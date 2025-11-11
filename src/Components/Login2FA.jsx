
// frontend/src/components/Login2FA.jsx

import React, { useState } from 'react';
import api from '../api/config';

const Login2FA = ({ email, tempToken, setup = null, onSuccess, onBack }) => {
  const [token, setToken] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(null);

  const handleVerify = async () => {
    try {
      setError('');
      if (!useBackupCode && (!token || token.length < 6)) {
        setError('Please enter a valid 6-digit authentication code.');
        return;
      }

      if (useBackupCode && !backupCode) {
        setError('Please enter a backup recovery code.');
        return;
      }

      setLoading(true);

      const payload = {
        tempToken,
        token: useBackupCode ? null : token,
        backupCode: useBackupCode ? backupCode : null
      };

      const res = await api.post('/auth/verify-2fa', payload);

      if (res?.data?.success && res?.data?.user) {
        onSuccess(res.data.user);
      } else {
        setError(res?.data?.message || 'Verification failed.');
      }
    } catch (err) {
      console.error('2FA verify error:', err);
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Secure Your Account</h2>
      <p className="text-gray-600 mb-4">
        Complete your sign-in by verifying your identity for <strong>{email}</strong>
      </p>

      {setup && (
        <div className="mb-4 p-4 bg-gray-50 rounded border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">Set Up Two-Factor Authentication</p>
          <p className="text-sm text-gray-600 mb-3">
            Scan the QR code below using an authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.).
          </p>

          {setup.qrCode ? (
            <div className="flex justify-center mb-4">
              <img src={setup.qrCode} alt="2FA QR Code" className="w-48 h-48" />
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-3">QR code unavailable.</p>
          )}

          <p className="font-semibold text-gray-800 mb-2">Backup Recovery Codes</p>
          <p className="text-sm text-gray-600 mb-3">
            Save these codes in a secure place. Each code can be used once if you lose access to your authenticator app.
          </p>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {Array.isArray(setup.backupCodes) && setup.backupCodes.map((code, idx) => (
              <button
                key={idx}
                onClick={() => copyToClipboard(code)}
                className="p-2 bg-white border rounded font-mono text-sm hover:bg-gray-100"
              >
                {code} {copied === code && <span className="text-green-600 ml-1">✓</span>}
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-500">
            Once your app is set up, enter your authentication code below to complete setup.
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {!useBackupCode ? (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Authentication Code
          </label>
          <input
            type="text"
            maxLength="6"
            placeholder="000000"
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
            className="w-full px-4 py-2 text-center text-2xl font-mono border border-gray-300 rounded mb-2"
          />
          <p
            onClick={() => setUseBackupCode(true)}
            className="text-blue-600 cursor-pointer text-sm hover:underline"
          >
            Use a backup recovery code
          </p>
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Backup Recovery Code
          </label>
          <input
            type="text"
            placeholder="XXXX-XXXX"
            value={backupCode}
            onChange={(e) => setBackupCode(e.target.value)}
            className="w-full px-4 py-2 font-mono border border-gray-300 rounded mb-2"
          />
          <p
            onClick={() => setUseBackupCode(false)}
            className="text-blue-600 cursor-pointer text-sm hover:underline"
          >
            Use authentication code instead
          </p>
        </div>
      )}

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 font-bold"
      >
        {loading ? 'Verifying...' : 'Verify and Continue'}
      </button>

      <button
        onClick={onBack}
        className="w-full mt-3 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 font-medium"
      >
        Back
      </button>
    </div>
  );
};

export default Login2FA;
