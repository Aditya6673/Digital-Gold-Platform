import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import User from "../models/User.mjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const rpName = "Digital Gold Platform";
const rpID = process.env.WEBAUTHN_RP_ID;
const origin = process.env.WEBAUTHN_ORIGIN;

const createAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const bufferToBase64URLString = (value) => {
  if (!value) return value;
  if (typeof value === "string") return value;
  if (Buffer.isBuffer(value)) return value.toString("base64url");
  if (value instanceof ArrayBuffer) return Buffer.from(value).toString("base64url");
  if (ArrayBuffer.isView(value)) {
    return Buffer.from(value.buffer, value.byteOffset, value.byteLength).toString("base64url");
  }
  return value;
};

const serializeRegistrationOptions = (options) => {
  if (!options) return options;
  return {
    ...options,
    challenge: bufferToBase64URLString(options.challenge),
    user: {
      ...options.user,
      id: bufferToBase64URLString(options.user?.id),
    },
    excludeCredentials: Array.isArray(options.excludeCredentials)
      ? options.excludeCredentials.map((cred) => ({
          ...cred,
          id: bufferToBase64URLString(cred.id),
        }))
      : [],
  };
};

const serializeAuthenticationOptions = (options) => {
  if (!options) return options;
  return {
    ...options,
    challenge: bufferToBase64URLString(options.challenge),
    allowCredentials: Array.isArray(options.allowCredentials)
      ? options.allowCredentials.map((cred) => ({
          ...cred,
          id: bufferToBase64URLString(cred.id),
        }))
      : [],
  };
};

// Generate registration options for WebAuthn
export const generateRegistrationOptionsHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'WebAuthn is only available for admin users' });
    }

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userName: user.email,
      userDisplayName: user.name,
      userID: Buffer.from(userId.toString()),
      timeout: 60000,
      attestationType: 'none',
      excludeCredentials: user.webauthnCredentials?.map(cred => ({
        id: cred.credentialID,
        type: 'public-key',
        transports: ['usb', 'nfc', 'ble', 'internal']
      })) || [],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'preferred',
        requireResidentKey: false
      },
      supportedAlgorithmIDs: [-7, -257],
    });

    // Store challenge in user session or temporary storage
    // For simplicity, we'll store it in a temporary field (in production, use Redis or session)
    user.webauthnChallenge = options.challenge;
    await user.save();

    res.json(serializeRegistrationOptions(options));
  } catch (err) {
    next(err);
  }
};

// Verify registration response
export const verifyRegistrationHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'WebAuthn is only available for admin users' });
    }

    const { body } = req;
    const expectedChallenge = user.webauthnChallenge;

    if (!expectedChallenge) {
      return res.status(400).json({ message: 'No registration challenge found' });
    }

    let verification;
    try {
      const expectedOriginLocal = origin || req.get('origin') || `http://localhost:3000`;
      let expectedRPIDLocal = rpID;
      if (!expectedRPIDLocal) {
        try {
          const url = new URL(expectedOriginLocal);
          expectedRPIDLocal = url.hostname;
        } catch (e) {
          expectedRPIDLocal = 'localhost';
        }
      }

      verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge,
        expectedOrigin: expectedOriginLocal,
        expectedRPID: expectedRPIDLocal,
        requireUserVerification: true
      });

    } catch (error) {
      console.error('verifyRegistrationResponse error:', error);
      if (error && error.stack) console.error(error.stack);
      return res.status(400).json({ message: `Verification failed: ${error.message}` });
    }

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      // Store the credential
      const credentialID = Buffer.from(registrationInfo.credentialID).toString('base64url');
      const newCredential = {
        credentialID: credentialID,
        credentialPublicKey: Buffer.from(registrationInfo.credentialPublicKey).toString('base64'),
        counter: registrationInfo.counter,
        deviceType: body.response?.authenticatorAttachment || 'unknown',
        registeredAt: new Date()
      };

      if (!user.webauthnCredentials) {
        user.webauthnCredentials = [];
      }
      user.webauthnCredentials.push(newCredential);
      user.webauthnEnabled = true;
      user.webauthnChallenge = undefined;
      await user.save();

      return res.json({ 
        verified: true, 
        message: 'WebAuthn credential registered successfully',
        credentialID: newCredential.credentialID
      });
    }

    res.status(400).json({ message: 'Registration verification failed' });
  } catch (err) {
    next(err);
  }
};

// Generate authentication options
export const generateAuthenticationOptionsHandler = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    
    if (!user || user.isDeleted) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'WebAuthn is only available for admin users' });
    }

    if (!user.webauthnEnabled || !user.webauthnCredentials || user.webauthnCredentials.length === 0) {
      return res.status(400).json({ 
        message: 'WebAuthn not registered for this user',
        requiresPassword: true 
      });
    }

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: user.webauthnCredentials.map(cred => ({
        id: cred.credentialID,
        type: 'public-key',
        transports: ['usb', 'nfc', 'ble', 'internal']
      })),
      userVerification: 'preferred',
      timeout: 60000
    });

    // Store challenge temporarily
    user.webauthnChallenge = options.challenge;
    await user.save();

    res.json(serializeAuthenticationOptions(options));
  } catch (err) {
    next(err);
  }
};

// Verify authentication response
export const verifyAuthenticationHandler = async (req, res, next) => {
  try {
    const { email, body: authenticationResponse } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    
    if (!user || user.isDeleted) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'WebAuthn is only available for admin users' });
    }

    if (!user.webauthnEnabled || !user.webauthnCredentials || user.webauthnCredentials.length === 0) {
      return res.status(400).json({ message: 'WebAuthn not registered for this user' });
    }

    const expectedChallenge = user.webauthnChallenge;
    if (!expectedChallenge) {
      return res.status(400).json({ message: 'No authentication challenge found' });
    }

    // DEBUG: log incoming authentication response and stored credentials
    try {
      console.log('--- WebAuthn Verify Request ---');
      console.log('Email:', email);
      console.log('Expected Challenge (stored):', expectedChallenge);
      console.log('Stored credentials (IDs):', (user.webauthnCredentials || []).map(c => c.credentialID));

      if (!authenticationResponse) {
        console.log('authenticationResponse is undefined or null');
      } else {
        console.log('authenticationResponse keys:', Object.keys(authenticationResponse));
        console.log('authenticationResponse.id (type):', typeof authenticationResponse.id, 'value:', authenticationResponse.id);
        console.log('authenticationResponse.rawId (typeof):', Object.prototype.toString.call(authenticationResponse.rawId));
        // If rawId is a string, print a short sample
        if (typeof authenticationResponse.rawId === 'string') {
          console.log('authenticationResponse.rawId (string sample):', authenticationResponse.rawId.slice(0, 80));
        }
      }
      console.log('--- End WebAuthn Verify Request ---');
    } catch (logErr) {
      console.error('Error logging WebAuthn request for debug:', logErr);
    }

    // Find the credential being used
    // The ID from the response is already base64url encoded
    const credentialIDFromResponse = authenticationResponse.id;
    const credential = user.webauthnCredentials.find(
      cred => {
        // Compare base64url strings directly
        try {
          const credBuffer = Buffer.from(cred.credentialID, 'base64url');
          const respBuffer = Buffer.from(credentialIDFromResponse, 'base64url');
          return credBuffer.equals(respBuffer);
        } catch {
          return cred.credentialID === credentialIDFromResponse;
        }
      }
    );

    if (!credential) {
      return res.status(400).json({ message: 'Credential not found' });
    }

    let verification;
    try {
      const expectedOriginLocal = origin || req.get('origin') || `http://localhost:3000`;
      let expectedRPIDLocal = rpID;
      if (!expectedRPIDLocal) {
        try {
          const url = new URL(expectedOriginLocal);
          expectedRPIDLocal = url.hostname;
        } catch (e) {
          expectedRPIDLocal = 'localhost';
        }
      }

      // DEBUG: show inputs to verifier
      try {
        console.log('Calling verifyAuthenticationResponse with:');
        console.log('  expectedChallenge:', expectedChallenge);
        console.log('  expectedOrigin:', expectedOriginLocal);
        console.log('  expectedRPID:', expectedRPIDLocal);
        console.log('  authenticator credentialID (base64url):', credential.credentialID);
        console.log('  authenticator credentialPublicKey (sample):', credential.credentialPublicKey?.slice(0, 60));
        console.log('  authenticator stored counter:', credential.counter);
        console.log('  authenticationResponse keys:', Object.keys(authenticationResponse || {}));
        console.log('  authenticationResponse.response keys:', authenticationResponse?.response ? Object.keys(authenticationResponse.response) : 'no response');
      } catch (logErr) {
        console.error('Error logging verifier inputs:', logErr);
      }

      verification = await verifyAuthenticationResponse({
        response: authenticationResponse,
        expectedChallenge,
        expectedOrigin: expectedOriginLocal,
        expectedRPID: expectedRPIDLocal,
        credential: {
          id: Buffer.from(credential.credentialID, 'base64url'),
          publicKey: Buffer.from(credential.credentialPublicKey, 'base64'),
          counter: typeof credential.counter === 'number' ? credential.counter : 0
        },
        requireUserVerification: true
      });
    } catch (error) {
      console.error('verifyAuthenticationResponse error:', error);
      if (error && error.stack) console.error(error.stack);
      return res.status(400).json({ message: `Authentication verification failed: ${error.message}` });
    }

    const { verified, authenticationInfo } = verification;

    if (verified) {
      // Update counter
      credential.counter = authenticationInfo.newCounter;
      user.webauthnChallenge = undefined;
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = createAccessToken(user);

      return res.json({
        verified: true,
        token,
        user: {
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }

    res.status(400).json({ message: 'Authentication verification failed' });
  } catch (err) {
    next(err);
  }
};

// Check if user has WebAuthn enabled
export const checkWebAuthnStatus = async (req, res, next) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email }).select('webauthnEnabled role');
    
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.json({ webauthnEnabled: false, requiresPassword: true });
    }

    res.json({ 
      webauthnEnabled: user.webauthnEnabled || false,
      requiresPassword: !user.webauthnEnabled
    });
  } catch (err) {
    next(err);
  }
};

