'use client';

import { useState } from 'react';
import { Lock, Mail, Trash2, Check, X, Eye, EyeOff } from 'lucide-react';
import '../../styles/setting.css';

const Setting = () => {
  const [activeSection, setActiveSection] = useState('password');
  const [showPasswords, setShowPasswords] = useState({});
  const [formState, setFormState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newEmail: '',
    otp: '',
    deleteConfirm: '',
  });
  const [step, setStep] = useState({
    password: 'form',
    email: 'form',
    delete: 'form',
  });
  const [message, setMessage] = useState({
    type: '',
    text: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (formState.newPassword !== formState.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    setMessage({ type: 'success', text: 'Password changed successfully' });
    setTimeout(() => {
      setFormState({ ...formState, currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: '', text: '' });
    }, 2000);
  };

  const handleEmailChange = (e) => {
    e.preventDefault();
    if (step.email === 'form') {
      setStep({ ...step, email: 'otp' });
      setMessage({ type: 'info', text: 'OTP sent to your current email' });
    } else if (step.email === 'otp') {
      if (formState.otp.length === 6) {
        setMessage({ type: 'success', text: 'Email changed successfully' });
        setTimeout(() => {
          setFormState({ ...formState, newEmail: '', otp: '' });
          setStep({ ...step, email: 'form' });
          setMessage({ type: '', text: '' });
        }, 2000);
      } else {
        setMessage({ type: 'error', text: 'Invalid OTP' });
      }
    }
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    if (step.delete === 'form') {
      if (formState.deleteConfirm !== 'DELETE') {
        setMessage({ type: 'error', text: 'Type "DELETE" to confirm' });
        return;
      }
      setStep({ ...step, delete: 'otp' });
      setMessage({ type: 'info', text: 'OTP sent to your email' });
    } else if (step.delete === 'otp') {
      if (formState.otp.length === 6) {
        setMessage({ type: 'success', text: 'Account deleted successfully' });
        setTimeout(() => {
          // Redirect to login or home
          window.location.href = '/login';
        }, 2000);
      } else {
        setMessage({ type: 'error', text: 'Invalid OTP' });
      }
    }
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your account security and preferences</p>
      </div>

      <div className="settings-content">
        {/* Sidebar Navigation */}
        <nav className="settings-nav">
          <button
            className={`nav-item ${activeSection === 'password' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('password');
              setMessage({ type: '', text: '' });
            }}
          >
            <Lock size={18} />
            <span>Reset Password</span>
          </button>
          <button
            className={`nav-item ${activeSection === 'email' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('email');
              setMessage({ type: '', text: '' });
            }}
          >
            <Mail size={18} />
            <span>Change Email</span>
          </button>
          <button
            className={`nav-item ${activeSection === 'delete' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('delete');
              setMessage({ type: '', text: '' });
            }}
          >
            <Trash2 size={18} />
            <span>Delete Account</span>
          </button>
        </nav>

        {/* Main Content */}
        <div className="settings-main">
          {/* Message Alert */}
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              <p>{message.text}</p>
            </div>
          )}

          {/* Reset Password Section */}
          {activeSection === 'password' && (
            <div className="section-card">
              <div className="section-header">
                <h2 className="section-title">Reset Password</h2>
                <p className="section-desc">Update your password to keep your account secure</p>
              </div>

              <form onSubmit={handlePasswordReset} className="form">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={formState.currentPassword}
                      onChange={handleInputChange}
                      placeholder="Enter current password"
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-btn"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={formState.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-btn"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formState.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-btn"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-primary">
                  <Check size={16} /> Update Password
                </button>
              </form>
            </div>
          )}

          {/* Change Email Section */}
          {activeSection === 'email' && (
            <div className="section-card">
              <div className="section-header">
                <h2 className="section-title">Change Email</h2>
                <p className="section-desc">Update your email address with OTP verification</p>
              </div>

              <form onSubmit={handleEmailChange} className="form">
                {step.email === 'form' && (
                  <div className="form-group">
                    <label className="form-label">New Email Address</label>
                    <input
                      type="email"
                      name="newEmail"
                      value={formState.newEmail}
                      onChange={handleInputChange}
                      placeholder="Enter new email"
                      className="form-input"
                      required
                    />
                  </div>
                )}

                {step.email === 'otp' && (
                  <div className="form-group">
                    <label className="form-label">Verification Code</label>
                    <p className="otp-info">Enter the 6-digit code sent to your email</p>
                    <input
                      type="text"
                      name="otp"
                      value={formState.otp}
                      onChange={(e) => handleInputChange({ target: { name: 'otp', value: e.target.value.replace(/\D/g, '').slice(0, 6) } })}
                      placeholder="000000"
                      className="form-input otp-input"
                      maxLength="6"
                      required
                    />
                  </div>
                )}

                <button type="submit" className="btn-primary">
                  <Check size={16} /> {step.email === 'form' ? 'Send OTP' : 'Verify & Change Email'}
                </button>
              </form>
            </div>
          )}

          {/* Delete Account Section */}
          {activeSection === 'delete' && (
            <div className="section-card danger">
              <div className="section-header">
                <h2 className="section-title">Delete Account</h2>
                <p className="section-desc">Permanently delete your account and all associated data</p>
              </div>

              <div className="danger-warning">
                <p>⚠️ This action cannot be undone. All your data will be permanently deleted.</p>
              </div>

              <form onSubmit={handleDeleteAccount} className="form">
                {step.delete === 'form' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Type "DELETE" to confirm</label>
                      <input
                        type="text"
                        name="deleteConfirm"
                        value={formState.deleteConfirm}
                        onChange={handleInputChange}
                        placeholder="Type DELETE"
                        className="form-input"
                        required
                      />
                      <p className="form-hint">
                        {formState.deleteConfirm === 'DELETE' ? '✓ Ready to delete' : 'You must type DELETE to proceed'}
                      </p>
                    </div>
                  </>
                )}

                {step.delete === 'otp' && (
                  <div className="form-group">
                    <label className="form-label">Verification Code</label>
                    <p className="otp-info">Enter the 6-digit code sent to your email</p>
                    <input
                      type="text"
                      name="otp"
                      value={formState.otp}
                      onChange={(e) => handleInputChange({ target: { name: 'otp', value: e.target.value.replace(/\D/g, '').slice(0, 6) } })}
                      placeholder="000000"
                      className="form-input otp-input"
                      maxLength="6"
                      required
                    />
                  </div>
                )}

                <button type="submit" className="btn-danger">
                  <Trash2 size={16} /> {step.delete === 'form' ? 'Delete Account' : 'Confirm Deletion'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setting;