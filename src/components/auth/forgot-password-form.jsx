'use client';

import { useState } from 'react';
import InputField from './input-field';
import PasswordInputField from './password-input-field';
import Button from '../ui/button';
import './styles/auth-forms.css';



export default function ForgotPasswordForm({
  onSwitchToLogin,
}) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('reset');
    }, 1500);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('email');
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      onSwitchToLogin();
    }, 1500);
  };

  return (
    <div className="auth-form-wrapper">
      <div className="form-header">
        <h1 className="form-title">Reset Password</h1>
        <p className="form-subtitle">
          {step === 'email' && 'Enter your email to receive verification code'}
          {step === 'otp' && 'Enter the code sent to your email'}
          {step === 'reset' && 'Create your new password'}
        </p>
      </div>

      <div className="form-content">
        {/* Email Step */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit}>
            <InputField
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              required
            />
            <Button type="submit" isLoading={isLoading}>
              {isLoading ? 'Sending Code...' : 'Send Verification Code'}
            </Button>
          </form>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit}>
            <InputField
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              label="Verification Code"
              maxLength={6}
              required
            />
            <div className="otp-info">
              <p>Check your email for the 6-digit code</p>
            </div>
            <Button type="submit" isLoading={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
          </form>
        )}

        {/* Reset Password Step */}
        {step === 'reset' && (
          <form onSubmit={handleResetSubmit}>
            <PasswordInputField
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              label="New Password"
              required
            />

            <PasswordInputField
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Confirm Password"
              required
            />

            <Button type="submit" isLoading={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}
      </div>

      <button
        type="button"
        className="back-link"
        onClick={onSwitchToLogin}
      >
        ← Back to Sign In
      </button>
    </div>
  );
}
