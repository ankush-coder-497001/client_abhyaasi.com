'use client';

import { useEffect } from 'react';
import { initializeGoogleSDK, decodeJWT } from '../../utils/googleOAuth';
import { registerOrLoginViaGoogle } from '../../api_services/users.api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function GoogleOneTapSignIn() {
  const navigate = useNavigate();

  useEffect(() => {
    const setupGoogleSDK = async () => {
      try {
        // Initialize Google SDK
        await initializeGoogleSDK();

        // Setup callback for One Tap (if it appears)
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleSignIn,
            auto_select: false,
            itp_support: true,
          });

          // Optionally show One Tap (comment out if you don't want automatic prompt)
          // window.google.accounts.id.prompt((notification) => {
          //   if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          //     console.log('One Tap not displayed');
          //   }
          // });
        }
      } catch (error) {
        console.error('Google SDK setup error:', error);
      }
    };

    const handleGoogleSignIn = async (response) => {
      try {
        if (!response.credential) {
          toast.error('Invalid Google response');
          return;
        }

        // Decode JWT to get user info
        const decoded = decodeJWT(response.credential);

        if (!decoded) {
          toast.error('Failed to decode Google response');
          return;
        }

        // Extract user data
        const userData = {
          name: decoded.name || decoded.given_name,
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
        console.error('OAuth Error:', error);
        toast.error(error.message || 'Sign in failed');
      }
    };

    setupGoogleSDK();

    // Cleanup
    return () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [navigate]);

  return null;
}
