
# frontend/src/components/CloudBackup.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CloudBackup = () => {
  const [backups, setBackups] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoringBackup, setRestoringBackup] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchBackups();
    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchBackups();
      fetchStats();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/backup/list');
      setBackups(response.data.data || []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch backups' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/backup/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setCreatingBackup(true);
      const response = await axios.post('/api/backup/create', {
        description
      });
      setMessage({ type: 'success', text: response.data.message });
      setDescription('');
      setShowDescription(false);
      setTimeout(() => {
        fetchBackups();
        fetchStats();
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create backup' });
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleRestoreBackup = async (backupId) => {
    if (!window.confirm('Are you sure? This will restore the database to the backup state.')) {
      return;
    }

    try {
      setRestoringBackup(backupId);
      const response = await axios.post(`/api/backup/restore/${backupId}`);
      setMessage({ type: 'success', text: response.data.message });
      setTimeout(() => {
        fetchBackups();
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to restore backup' });
    } finally {
      setRestoringBackup(null);
    }
  };

  const handleDownloadBackup = async (backupId, backupName) => {
    try {
      const response = await axios.get(`/api/backup/download/${backupId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', backupName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to download backup' });
    }
  };

  const handleDeleteBackup = async (backupId) => {
    if (!window.confirm('Are you sure you want to delete this backup?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/backup/delete/${backupId}`);
      setMessage({ type: 'success', text: response.data.message });
      fetchBackups();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete backup' });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBackupTypeColor = (type) => {
    switch (type) {
      case 'manual': return 'bg-blue-100 text-blue-800';
      case 'automatic': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">☁️ Cloud Backup & Restoration</h3>
        <button
          onClick={() => setShowDescription(!showDescription)}
          disabled={creatingBackup}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {creatingBackup ? '⏳ Creating...' : '+ Create Backup'}
        </button>
      </div>

      {message.text && (
        <div className={`p-3 rounded mb-4 ${
          message.type === 'error' ? 'bg-red-100 text-red-800' :
          'bg-green-100 text-green-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <p className="text-gray-600 text-sm">Total Backups</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalBackups}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <p className="text-gray-600 text-sm">Total Size</p>
            <p className="text-2xl font-bold text-gray-800">{stats.formattedTotalSize}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completedBackups}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <p className="text-gray-600 text-sm">Last Backup</p>
            <p className="text-sm font-bold text-gray-800">
              {stats.lastBackup ? formatDate(stats.lastBackup) : 'Never'}
            </p>
          </div>
        </div>
      )}

      {/* Create Backup Form */}
      {showDescription && (
        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Backup Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add notes about this backup..."
            className="w-full p-2 border border-gray-300 rounded text-sm mb-3"
            rows="2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateBackup}
              disabled={creatingBackup}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {creatingBackup ? 'Creating...' : 'Create Backup'}
            </button>
            <button
              onClick={() => {
                setShowDescription(false);
                setDescription('');
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Backups List */}
      <div>
        <h4 className="font-bold text-gray-700 mb-4">Available Backups</h4>
        
        {loading && !backups.length ? (
          <p className="text-gray-600">Loading backups...</p>
        ) : backups.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded text-center border border-gray-200">
            <p className="text-gray-600">No backups yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-bold">Backup Name</th>
                  <th className="px-4 py-2 text-left text-sm font-bold">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-bold">Size</th>
                  <th className="px-4 py-2 text-left text-sm font-bold">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-bold">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((backup) => (
                  <tr key={backup.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-800">{backup.backupName}</p>
                        {backup.description && (
                          <p className="text-xs text-gray-500">{backup.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getBackupTypeColor(backup.backupType)}`}>
                        {backup.backupType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {backup.formattedSize}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatDate(backup.createdAt)}
                    </td>
                    <td className={`px-4 py-3 text-sm font-bold ${getStatusColor(backup.status)}`}>
                      {backup.status}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownloadBackup(backup.id, backup.backupName)}
                          className="text-blue-600 hover:text-blue-800 font-bold"
                          title="Download"
                        >
                          ⬇️
                        </button>
                        <button
                          onClick={() => handleRestoreBackup(backup.id)}
                          disabled={restoringBackup === backup.id}
                          className="text-green-600 hover:text-green-800 font-bold disabled:text-gray-400"
                          title="Restore"
                        >
                          {restoringBackup === backup.id ? '⏳' : '↩️'}
                        </button>
                        <button
                          onClick={() => handleDeleteBackup(backup.id)}
                          className="text-red-600 hover:text-red-800 font-bold"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudBackup;