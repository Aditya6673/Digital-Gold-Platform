import { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';
import User from '../models/User.mjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const rpName = 'Digital Gold Platform';
const rpID = process.env.WEBAUTHN_RP_ID;
const origin = process.env.WEBAUTHN_ORIGIN;

const createAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
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
        id: Buffer.from(cred.credentialID, 'base64url'),
        type: 'public-key',
        transports: ['usb', 'nfc', 'ble', 'internal']
      })) || [],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'preferred',
        requireResidentKey: false
      },
      supportedAlgorithmIDs: [-7, -257]
    });

    // Store challenge in user session or temporary storage
    // For simplicity, we'll store it in a temporary field (in production, use Redis or session)
    user.webauthnChallenge = options.challenge;
    await user.save();

    res.json(options);
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
      verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        requireUserVerification: true
      });
    } catch (error) {
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
        id: Buffer.from(cred.credentialID, 'base64url'),
        type: 'public-key',
        transports: ['usb', 'nfc', 'ble', 'internal']
      })),
      userVerification: 'preferred',
      timeout: 60000
    });

    // Store challenge temporarily
    user.webauthnChallenge = options.challenge;
    await user.save();

    res.json(options);
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
      verification = await verifyAuthenticationResponse({
        response: authenticationResponse,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        authenticator: {
          credentialID: Buffer.from(credential.credentialID, 'base64url'),
          credentialPublicKey: Buffer.from(credential.credentialPublicKey, 'base64'),
          counter: credential.counter
        },
        requireUserVerification: true
      });
    } catch (error) {
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

