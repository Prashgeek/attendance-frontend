
// frontend/src/components/TwoFactorAuth.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TwoFactorAuth = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [verificationToken, setVerificationToken] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [status, setStatus] = useState({ enabled: false });
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await axios.get('/api/2fa/status');
      setStatus(response.data.data);
    } catch (error) {
      console.error('Error fetching 2FA status:', error);
    }
  };

  const handleSetupStart = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/2fa/setup');
      setQrCode(response.data.data.qrCode);
      setBackupCodes(response.data.data.backupCodes);
      setShowSetup(true);
      setMessage({ type: 'info', text: response.data.data.message });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to setup 2FA' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      if (!verificationToken || verificationToken.length < 6) {
        setMessage({ type: 'error', text: 'Please enter a valid 6-digit code' });
        return;
      }

      setLoading(true);
      const response = await axios.post('/api/2fa/verify-setup', {
        token: verificationToken
      });

      setMessage({ type: 'success', text: response.data.message });
      setShowBackupCodes(true);
      setVerificationToken('');
      setTimeout(() => {
        fetchStatus();
        setShowSetup(false);
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Invalid verification code' });
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (password) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/2fa/disable', { password });
      setMessage({ type: 'success', text: response.data.message });
      setTimeout(() => {
        fetchStatus();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to disable 2FA' });
    } finally {
      setLoading(false);
    }
  };

  const copyBackupCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">🔐 Two-Factor Authentication</h3>
      
      {message.text && (
        <div className={`p-3 rounded mb-4 ${
          message.type === 'error' ? 'bg-red-100 text-red-800' :
          message.type === 'success' ? 'bg-green-100 text-green-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {message.text}
        </div>
      )}

      {!status.enabled ? (
        <div>
          <p className="text-gray-600 mb-4">
            Two-factor authentication adds an extra layer of security to your account.
          </p>
          <button
            onClick={handleSetupStart}
            disabled={loading || showSetup}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Setting up...' : 'Enable 2FA'}
          </button>

          {showSetup && (
            <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
              <h4 className="font-bold mb-4">Step 1: Scan QR Code</h4>
              {qrCode && (
                <div className="flex justify-center mb-4">
                  <img src={qrCode} alt="2FA QR Code" className="w-64 h-64" />
                </div>
              )}
              
              <h4 className="font-bold mb-2">Step 2: Enter Verification Code</h4>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                value={verificationToken}
                onChange={(e) => setVerificationToken(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-32 text-center font-mono text-2xl"
              />
              
              <button
                onClick={handleVerify}
                disabled={loading || verificationToken.length < 6}
                className="bg-green-600 text-white px-4 py-2 rounded ml-2 hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>

              {showBackupCodes && backupCodes.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="font-bold text-yellow-800 mb-2">⚠️ Save Your Backup Codes</p>
                  <p className="text-sm text-yellow-700 mb-3">
                    Keep these codes in a safe place. Use them if you lose access to your authenticator app.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, idx) => (
                      <div
                        key={idx}
                        onClick={() => copyBackupCode(code)}
                        className="bg-white p-2 rounded border cursor-pointer hover:bg-gray-100 font-mono text-sm"
                      >
                        {code}
                        {copiedCode === code && (
                          <span className="text-green-600 ml-2">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
            <p className="text-green-800 font-bold">✓ Two-Factor Authentication is Enabled</p>
            <p className="text-green-700 text-sm">Last used: {
              status.lastUsedAt ? new Date(status.lastUsedAt).toLocaleDateString() : 'Never'
            }</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleDisable(prompt('Enter your password:'))}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
            >
              Disable 2FA
            </button>
            <button
              onClick={async () => {
                const response = await axios.post('/api/2fa/regenerate-backup-codes', {
                  password: prompt('Enter your password:')
                });
                setBackupCodes(response.data.data.backupCodes);
                setShowBackupCodes(true);
                setMessage({ type: 'success', text: 'Backup codes regenerated' });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Regenerate Codes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoFactorAuth;