'use client';

import { useEffect, useRef } from 'react';
import { initializeGoogleSDK, decodeJWT } from '../../utils/googleOAuth';
import { registerOrLoginViaGoogle } from '../../api_services/users.api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './styles/google-button.css';

export default function GoogleButton() {
  const buttonContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const renderGoogleButton = async () => {
      try {
        // Initialize Google SDK
        await initializeGoogleSDK();

        // Ensure SDK is loaded
        if (window.google?.accounts?.id && buttonContainerRef.current) {
          // Initialize with callback
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleSignIn,
            auto_select: false,
            itp_support: true,
          });

          // Render the official Google Sign-In button
          window.google.accounts.id.renderButton(buttonContainerRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
          });
        }
      } catch (error) {
        console.error('Google button setup error:', error);
        toast.error('Failed to load Google Sign-In');
      }
    };

    renderGoogleButton();
  }, []);

  const handleGoogleSignIn = async (response) => {
    try {
      if (!response?.credential) {
        toast.error('Invalid Google response');
        return;
      }

      // Decode JWT to get user info
      const decoded = decodeJWT(response.credential);

      if (!decoded) {
        toast.error('Failed to process Google response');
        return;
      }

      // Extract user data
      const userData = {
        name: decoded.name || decoded.given_name || 'User',
        email: decoded.email,
        googleId: decoded.sub,
        picture: decoded.picture,
      };

      // Call backend OAuth endpoint
      const result = await registerOrLoginViaGoogle(userData);

      if (result.token) {
        localStorage.setItem('abhyaasi_authToken', result.token);
        localStorage.setItem('abhyaasi_user', JSON.stringify(result.user));

        toast.success(result.message || 'Sign in successful!');

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      toast.error(error.message || 'Sign in failed. Please try again.');
    }
  };

  return (
    <div className="google-signin-container">
      <div ref={buttonContainerRef} className="google-button-wrapper" />
    </div>
  );
}
