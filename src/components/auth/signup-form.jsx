
import { useState } from 'react';
import InputField from './input-field';
import PasswordInputField from './password-input-field';
import Button from '../ui/button';
import GoogleButton from './google-button';
import './styles/auth-forms.css';
import { registerUser } from '../../api_services';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


export default function SignupForm({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await registerUser(formData);
      toast.success(res.message || 'Registration successful');
      localStorage.setItem('abhyaasi_authToken', res.token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error.message || 'Registration failed');
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
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
