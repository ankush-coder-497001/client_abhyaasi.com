'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './styles/password-input-field.css';

export default function PasswordInputField({
  placeholder,
  value,
  onChange,
  label,
  name,
  required,
  maxLength,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <div className="password-input-container">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          required={required}
          maxLength={maxLength}
          className="input-field password-field"
        />
        <button
          type="button"
          className="password-toggle-btn"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff size={16} />
          ) : (
            <Eye size={16} />
          )}
        </button>
      </div>
      <div className="input-focus-line"></div>
    </div>
  );
}
