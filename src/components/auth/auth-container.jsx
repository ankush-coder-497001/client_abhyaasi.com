'use client';

import { useState } from 'react';
import LoginForm from './login-form';
import SignupForm from './signup-form';
import ForgotPasswordForm from './forgot-password-form';
import AuthBanner from './auth-banner';
import GoogleOneTapSignIn from './GoogleOneTapSignIn';
import './styles/auth-container.css';
import './styles/global.css';


export default function AuthContainer() {
  const [mode, setMode] = useState('login');

  return (
    <div className="auth-container">
      <GoogleOneTapSignIn />
      <div className={`auth-wrapper auth-${mode}`}>
        {/* Banner side - slides with form */}
        <div className="auth-banner-section">
          <AuthBanner mode={mode} />
        </div>

        {/* Form side - slides with smooth transition */}
        <div className="auth-form-section">
          {mode === 'login' && (
            <LoginForm
              onSwitchToSignup={() => setMode('signup')}
              onSwitchToForgot={() => setMode('forgot')}
            />
          )}
          {mode === 'signup' && (
            <SignupForm onSwitchToLogin={() => setMode('login')} />
          )}
          {mode === 'forgot' && (
            <ForgotPasswordForm onSwitchToLogin={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  );
}
