
// frontend/src/services/settings.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ===== SETTINGS CRUD =====

/**
 * Get current settings
 * @returns {Promise} Settings data
 */
export const getSettings = () => {
  return api.get('/api/settings');
};

/**
 * Update settings
 * @param {Object} settingsData - Settings object to update
 * @returns {Promise} Updated settings
 */
export const updateSettings = (settingsData) => {
  return api.put('/api/settings', settingsData);
};

// ===== EMAIL OPERATIONS =====

/**
 * Test email configuration
 * @param {string} testEmail - Email address to send test email to
 * @returns {Promise} Test email response
 */
export const testEmail = (testEmail) => {
  return api.post('/api/settings/test-email', { testEmail });
};

// ===== BACKUP OPERATIONS =====

/**
 * Create a new backup
 * @returns {Promise} Backup created response
 */
export const createBackup = () => {
  return api.post('/api/settings/backup');
};

/**
 * Get all available backups
 * @returns {Promise} List of available backups
 */
export const getBackups = () => {
  return api.get('/api/settings/backups');
};

/**
 * Restore from a backup
 * @param {string} backupFile - Backup filename to restore from
 * @returns {Promise} Restore response
 */
export const restoreBackup = (backupFile) => {
  return api.post('/api/settings/restore', { backupFile });
};

/**
 * Download backup file
 * @param {string} filename - Backup filename to download
 */
export const downloadBackup = (filename) => {
  const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings/backup/download/${filename}`;
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Cleanup old backups
 * @returns {Promise} Cleanup response
 */
export const cleanupBackups = () => {
  return api.delete('/api/settings/backups/cleanup');
};

// ===== ERROR INTERCEPTOR =====

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;