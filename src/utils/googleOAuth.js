// Google OAuth Configuration and Utilities

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export const initializeGoogleSDK = () => {
  return new Promise((resolve) => {
    if (window.google) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

export const initializeGoogleOneTap = (onSuccess, onError) => {
  if (!window.google) {
    console.error('Google SDK not loaded');
    onError('Google SDK not loaded');
    return;
  }

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: onSuccess,
    auto_select: true,
    itp_support: true,
  });

  window.google.accounts.id.renderButton(
    document.getElementById('google-signin-button'),
    {
      theme: 'outline',
      size: 'large',
      width: '100%',
    }
  );

  // Attempt One Tap
  window.google.accounts.id.prompt((notification) => {
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      console.log('One Tap not displayed or skipped');
    }
  });
};

export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export { GOOGLE_CLIENT_ID };
