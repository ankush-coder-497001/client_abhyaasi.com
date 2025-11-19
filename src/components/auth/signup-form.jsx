'use client';

import { useState } from 'react';
import InputField from './input-field';
import PasswordInputField from './password-input-field';
import Button from './button';
import GoogleButton from './google-button';
import './auth-forms.css';


export default function SignupForm({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="auth-form-wrapper">
      <div className="form-header">
        <h1 className="form-title">Create Account</h1>
        <p className="form-subtitle">Join our community today</p>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        <InputField
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          name="name"
          label="Full Name"
          required
        />

        <InputField
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          name="email"
          label="Email Address"
          required
        />

        <PasswordInputField
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          name="password"
          label="Password"
          required
        />

        <PasswordInputField
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
          label="Confirm Password"
          required
        />

        <Button type="submit" isLoading={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="divider">
        <span>Or sign up with</span>
      </div>

      <GoogleButton />

      <div className="form-footer">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            className="switch-auth-link"
            onClick={onSwitchToLogin}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
