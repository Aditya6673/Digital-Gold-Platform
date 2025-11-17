import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import api from '../lib/axios';

const bufferToBase64URLString = (buffer) => {
  if (!buffer) return null;
  const bytes = new Uint8Array(buffer);
  let str = '';
  bytes.forEach((b) => {
    str += String.fromCharCode(b);
  });
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

/**
 * Check if WebAuthn is supported in the browser
 */
export const isWebAuthnSupported = () => {
  return !!(navigator.credentials && navigator.credentials.create);
};

/**
 * Check if user has WebAuthn enabled
 */
export const checkWebAuthnStatus = async (email) => {
  try {
    const response = await api.get('/api/webauthn/status', { params: { email } });
    return response.data;
  } catch (error) {
    console.error('Error checking WebAuthn status:', error);
    return { webauthnEnabled: false, requiresPassword: true };
  }
};

/**
 * Register WebAuthn credential (for admin users)
 */
export const registerWebAuthn = async () => {
  try {
    // Generate registration options
    const optionsResponse = await api.post('/api/webauthn/register/generate');
    const options = optionsResponse.data;

    // Start registration
    const credential = await startRegistration(options);

    const payload = {
      id: credential.id,
      rawId: bufferToBase64URLString(credential.rawId),
      type: credential.type,
      authenticatorAttachment: credential.authenticatorAttachment,
      response: {
        clientDataJSON: bufferToBase64URLString(credential.response.clientDataJSON),
        attestationObject: bufferToBase64URLString(credential.response.attestationObject),
        transports: credential.response?.getTransports?.() || []
      },
      clientExtensionResults: credential.getClientExtensionResults()
    };

    // Verify registration
    const verifyResponse = await api.post('/api/webauthn/register/verify', payload);
    
    return {
      success: verifyResponse.data.verified,
      message: verifyResponse.data.message || 'WebAuthn credential registered successfully'
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'WebAuthn registration failed';
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Authenticate with WebAuthn
 */
export const authenticateWebAuthn = async (email) => {
  try {
    // Generate authentication options
    const optionsResponse = await api.post('/api/webauthn/authenticate/generate', { email });
    const options = optionsResponse.data;

    // Start authentication
    const authenticationResponse = await startAuthentication(options);

    const payload = {
      id: authenticationResponse.id,
      rawId: bufferToBase64URLString(authenticationResponse.rawId),
      type: authenticationResponse.type,
      authenticatorAttachment: authenticationResponse.authenticatorAttachment,
      response: {
        clientDataJSON: bufferToBase64URLString(authenticationResponse.response.clientDataJSON),
        authenticatorData: bufferToBase64URLString(authenticationResponse.response.authenticatorData),
        signature: bufferToBase64URLString(authenticationResponse.response.signature),
        userHandle: authenticationResponse.response.userHandle
          ? bufferToBase64URLString(authenticationResponse.response.userHandle)
          : null
      },
      clientExtensionResults: authenticationResponse.getClientExtensionResults()
    };

    // Verify authentication
    const verifyResponse = await api.post('/api/webauthn/authenticate/verify', {
      email,
      body: payload
    });

    if (verifyResponse.data.verified) {
      return {
        success: true,
        token: verifyResponse.data.token,
        user: verifyResponse.data.user
      };
    }

    return {
      success: false,
      error: 'Authentication verification failed'
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'WebAuthn authentication failed';
    
    // Check if it's because WebAuthn is not registered
    if (error.response?.status === 400 && error.response?.data?.requiresPassword) {
      return {
        success: false,
        requiresPassword: true,
        error: 'WebAuthn not registered. Please use password login or register WebAuthn first.'
      };
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};
