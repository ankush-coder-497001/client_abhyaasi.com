'use client';

import { useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { IconLogout } from '@tabler/icons-react';
import './logout-modal.css';

export default function LogoutModal({ isOpen, onConfirm, onCancel, useTablerIcon = true }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const LogoutIcon = useTablerIcon ? IconLogout : LogOut;

  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal-container">
        <div className="logout-modal-content">
          <div className="logout-modal-icon">
            <LogoutIcon className={useTablerIcon ? 'h-6 w-6 text-red-600' : 'h-6 w-6 text-red-600'} />
          </div>

          <div className="logout-modal-header">
            <h3 className="logout-modal-title">Logout</h3>
            <p className="logout-modal-subtitle">Are you sure?</p>
          </div>

          <p className="logout-modal-message">
            You will be logged out of your account. You can log back in anytime.
          </p>

          <div className="logout-modal-actions">
            <button onClick={onCancel} className="logout-modal-btn logout-modal-btn-cancel">
              Cancel
            </button>
            <button onClick={onConfirm} className="logout-modal-btn logout-modal-btn-confirm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
