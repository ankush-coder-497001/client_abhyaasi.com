import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, LogIn } from 'lucide-react';

const TokenExpired = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear auth token from localStorage
    localStorage.removeItem('abhyaasi_authToken');
    localStorage.removeItem('abhyaasi_user');
  }, []);

  const handleLoginClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Modal Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center transform transition-all duration-300 hover:shadow-3xl">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>
              <div className="relative bg-red-50 rounded-full p-4">
                <AlertCircle size={48} className="text-red-600" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Expired</h1>

          {/* Subtitle */}
          <p className="text-gray-600 mb-2">
            Your login session has expired
          </p>

          {/* Description */}
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            For your security, your session was closed. Please log in again to continue accessing your dashboard and courses.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLoginClick}
              className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <LogIn size={20} />
              Login Again
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition-all duration-200"
            >
              Back to Home
            </button>
          </div>

          {/* Footer Message */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help? <a href="mailto:support@abhyaasi.com" className="text-blue-600 hover:text-blue-700 font-semibold">Contact Support</a>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-xs text-blue-700">
            🔒 Your account is secure. Sessions expire automatically for your protection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenExpired;
