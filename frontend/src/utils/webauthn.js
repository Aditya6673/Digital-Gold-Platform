import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import api from '../lib/axios';

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

    // Verify registration
    const verifyResponse = await api.post('/api/webauthn/register/verify', credential);
    
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

    // Verify authentication
    const verifyResponse = await api.post('/api/webauthn/authenticate/verify', {
      email,
      body: authenticationResponse
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

