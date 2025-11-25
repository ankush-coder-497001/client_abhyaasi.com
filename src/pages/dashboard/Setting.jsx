'use client';

import { useState } from 'react';
import { Lock, Mail, Trash2, Check, X, Eye, EyeOff, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoutModal from '../../components/modals/LogoutModal';
import '../../styles/setting.css';
import Button from '../../components/ui/button';
import Loader from '../../components/ui/Loader';
import { deleteAccount, resetPassword, updateEmail } from '../../api_services';
import toast from 'react-hot-toast';

const Setting = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('password');
  const [showPasswords, setShowPasswords] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading settings...');
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (formState.newPassword !== formState.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    setLoadingText('Updating password...');
    setIsLoading(true);
    console.log(formState.currentPassword, formState.newPassword);
    try {
      await resetPassword({ currentPassword: formState.currentPassword, newPassword: formState.newPassword });
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setFormState({ ...formState, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    if (step.email === 'form') {
      setLoadingText('Sending OTP to new email...');
      setIsLoading(true);
      try {
        const res = await updateEmail(formState.newEmail);
        setStep({ ...step, email: 'otp' });
        setMessage({ type: 'info', text: 'OTP sent to your new email' });
      } catch (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to send OTP' });
      } finally {
        setIsLoading(false);
      }
    } else if (step.email === 'otp') {
      try {
        setLoadingText('Verifying OTP...');
        setIsLoading(true);
        const res = await updateEmail(formState.newEmail, formState.otp);
        const { token } = res;
        localStorage.setItem('abhyaasi_authToken', token);
        setMessage({ type: 'success', text: 'Email updated successfully' });
        setFormState({ ...formState, newEmail: '', otp: '' });
        setStep({ ...step, email: 'form' });
      } catch (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to verify OTP' });
      } finally {
        setIsLoading(false);
        setStep({ ...step, email: 'form' });
      }
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (step.delete === 'form') {
      if (formState.deleteConfirm !== 'DELETE') {
        setMessage({ type: 'error', text: 'Type "DELETE" to confirm' });
        return;
      }
      try {
        setLoadingText('Sending OTP to your email...');
        setIsLoading(true);
        await deleteAccount();
        setStep({ ...step, delete: 'otp' });
        setMessage({ type: 'info', text: 'OTP sent to your email' });
      } catch (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to initiate account deletion' });
      } finally {
        setIsLoading(false);
      }
    } else if (step.delete === 'otp') {
      try {
        setLoadingText('Verifying OTP and deleting account...');
        setIsLoading(true);
        await deleteAccount(formState.otp);
        localStorage.removeItem('abhyaasi_authToken');
        localStorage.removeItem('abhyaasi_user');
        navigate('/');
        toast.success('Account deleted successfully');
      } catch (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to delete account' });
      } finally {
        setIsLoading(false);
        setStep({ ...step, delete: 'form' });
      }
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('abhyaasi_authToken');
    localStorage.removeItem('abhyaasi_user');
    setShowLogoutModal(false);
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  if (isLoading) {
    return <Loader text={loadingText} />;
  }

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
          <button
            className="nav-item logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
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
                  <Check size={16} /> {isLoading ? 'Updating...' : 'Update Password'}
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
                  <Check size={16} /> {isLoading && step.email === 'form' ? 'Sending OTP...' : step.email === 'form' ? 'Send OTP' : 'Verify & Change Email'}
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

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        useTablerIcon={false}
      />
    </div>
  );
};

export default Setting;