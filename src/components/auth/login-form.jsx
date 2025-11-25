'use client';

import { useEffect, useState } from 'react';
import InputField from './input-field';
import PasswordInputField from './password-input-field';
import Button from '../ui/button';
import GoogleButton from './google-button';
import './styles/auth-forms.css';
import { loginUser } from '../../api_services';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';



export default function LoginForm({
  onSwitchToSignup,
  onSwitchToForgot,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await loginUser({ email, password });
      toast.success(res.message || 'Login successful');
      localStorage.setItem('abhyaasi_authToken', res.token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error.message || 'Login failed');
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-wrapper">
      <div className="form-header">
        <h1 className="form-title">Sign In</h1>
        <p className="form-subtitle">Enter your credentials to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        <InputField
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email Address"
          required
        />

        <PasswordInputField
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          required
        />

        <div className="form-actions">
          <button
            type="button"
            className="forgot-password-link"
            onClick={onSwitchToForgot}
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" isLoading={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="divider">
        <span>Or continue with</span>
      </div>

      <GoogleButton />

      <div className="form-footer">
        <p>
          Don't have an account?{' '}
          <button
            type="button"
            className="switch-auth-link"
            onClick={onSwitchToSignup}
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
