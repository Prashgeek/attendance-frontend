
// frontend/src/pages/AdminSettings.jsx

import React, { useState, useEffect } from "react";
import {
  getSettings,
  updateSettings,
  testEmail,
  createBackup,
  getBackups,
  restoreBackup,
  downloadBackup,
  cleanupBackups,
} from "../../services/settings";

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [backups, setBackups] = useState([]);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoringBackup, setRestoringBackup] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [messages, setMessages] = useState({ success: "", error: "" });

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
    fetchBackups();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getSettings();
      setSettings(response.data.data);
      console.log("✅ Settings loaded:", response.data.data);
    } catch (error) {
      showMessage("error", "Failed to load settings: " + error.message);
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackups = async () => {
    try {
      const response = await getBackups();
      setBackups(response.data.data || []);
      console.log("✅ Backups loaded:", response.data.data);
    } catch (error) {
      showMessage("error", "Failed to load backups: " + error.message);
      console.error("Error loading backups:", error);
    }
  };

  const showMessage = (type, message) => {
    setMessages({ [type]: message });
    setTimeout(() => {
      setMessages({ success: "", error: "" });
    }, 5000);
  };

  const handleChange = (key, value) => {
    setSettings((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
  };

  const handleSaveSettings = async () => {
    try {
      if (!settings) {
        showMessage("error", "Settings not loaded");
        return;
      }

      setSaving(true);
      const response = await updateSettings(settings);
      showMessage("success", response.data.message);
      console.log("✅ Settings saved successfully");
      console.log("Saved settings:", settings);
    } catch (error) {
      showMessage("error", "Failed to save settings: " + error.message);
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      if (!testEmailAddress) {
        showMessage("error", "Please enter an email address");
        return;
      }

      setTestingEmail(true);
      const response = await testEmail(testEmailAddress);
      showMessage("success", response.data.message);
      setTestEmailAddress("");
      console.log("✅ Test email sent successfully");
    } catch (error) {
      showMessage("error", "Failed to send test email: " + error.message);
      console.error("Error sending test email:", error);
    } finally {
      setTestingEmail(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setCreatingBackup(true);
      const response = await createBackup();
      showMessage("success", response.data.message);
      console.log("✅ Backup created:", response.data.data);
      // Reload backups
      await fetchBackups();
    } catch (error) {
      showMessage("error", "Failed to create backup: " + error.message);
      console.error("Error creating backup:", error);
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleRestoreBackup = async () => {
    try {
      if (!selectedBackup) {
        showMessage("error", "Please select a backup to restore");
        return;
      }

      if (!window.confirm("Are you sure? This will overwrite the current database.")) {
        return;
      }

      setRestoringBackup(true);
      const response = await restoreBackup(selectedBackup);
      showMessage("success", response.data.message);
      console.log("✅ Backup restored successfully");
      setSelectedBackup(null);
    } catch (error) {
      showMessage("error", "Failed to restore backup: " + error.message);
      console.error("Error restoring backup:", error);
    } finally {
      setRestoringBackup(false);
    }
  };

  const handleDownloadBackup = (filename) => {
    try {
      downloadBackup(filename);
      console.log("✅ Downloading backup:", filename);
    } catch (error) {
      showMessage("error", "Failed to download backup: " + error.message);
      console.error("Error downloading backup:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-7xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Failed to load settings. Please refresh the page.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      {/* Status Messages */}
      {messages.success && (
        <div className="max-w-7xl mx-auto bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          ✅ {messages.success}
        </div>
      )}
      {messages.error && (
        <div className="max-w-7xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          ❌ {messages.error}
        </div>
      )}

      {/* Notification Settings */}
      <section className="max-w-7xl mx-auto bg-white rounded-xl shadow p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
           Notification Settings
        </h2>
        <p className="text-gray-600 text-sm mt-1 mb-4">
          Configure how and when you receive notifications
        </p>

        {[
          {
            id: "emailNotifications",
            title: " Email Notifications",
            desc: "Receive email alerts for absences and late arrivals",
          },
          {
            id: "smsNotifications",
            title: " SMS Notifications",
            desc: "Send SMS alerts to parents/guardians",
          },
          {
            id: "pushNotifications",
            title: " Push Notifications",
            desc: "Real-time push notifications via Firebase",
          },
          {
            id: "dailyReports",
            title: " Daily Reports",
            desc: "Automatically send daily attendance summary to admin",
          },
        ].map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b last:border-b-0 gap-2"
          >
            <div className="max-w-full sm:max-w-[75%]">
              <p className="font-medium text-gray-900">{item.title}</p>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer self-end sm:self-auto">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings[item.id] || false}
                onChange={(e) => handleChange(item.id, e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-gray-900 transition-all after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:after:translate-x-5"></div>
            </label>
          </div>
        ))}
      </section>

      {/* Working Hours Configuration */}
      <section className="max-w-7xl mx-auto bg-white rounded-xl shadow p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
           Working Hours Configuration
        </h2>
        <p className="text-gray-600 text-sm mt-1 mb-4">
          Set check-in/check-out time parameters
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-semibold text-gray-900 text-sm">
              Standard Check-In Time
            </label>
            <input
              type="time"
              value={settings.standardCheckIn || "09:00"}
              onChange={(e) => handleChange("standardCheckIn", e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-900 text-sm">
              Standard Check-Out Time
            </label>
            <input
              type="time"
              value={settings.standardCheckOut || "17:00"}
              onChange={(e) => handleChange("standardCheckOut", e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-900 text-sm">
              Late Arrival Threshold (minutes)
            </label>
            <input
              type="number"
              value={settings.lateArrivalThreshold || 15}
              min={0}
              onChange={(e) =>
                handleChange("lateArrivalThreshold", parseInt(e.target.value))
              }
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-900 text-sm">
              Minimum Working Hours
            </label>
            <input
              type="number"
              step="0.5"
              value={settings.minimumWorkingHours || 4.5}
              onChange={(e) =>
                handleChange("minimumWorkingHours", parseFloat(e.target.value))
              }
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
            />
          </div>
        </div>
      </section>

      {/* Email Service Configuration */}
      <section className="max-w-7xl mx-auto bg-white rounded-xl shadow p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
           Email Service Configuration
        </h2>
        <p className="text-gray-600 text-sm mt-1 mb-4">
          Configure SMTP settings for email notifications
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-semibold text-gray-900 text-sm">
              SMTP Host
            </label>
            <input
              type="text"
              value={settings.smtpHost || "smtp.gmail.com"}
              onChange={(e) => handleChange("smtpHost", e.target.value)}
              placeholder="smtp.gmail.com"
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-900 text-sm">
              SMTP Port
            </label>
            <input
              type="number"
              value={settings.smtpPort || 587}
              onChange={(e) => handleChange("smtpPort", parseInt(e.target.value))}
              placeholder="587"
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-semibold text-gray-900 text-sm">
              From Email
            </label>
            <input
              type="email"
              value={settings.fromEmail || "noreply@attendance.com"}
              onChange={(e) => handleChange("fromEmail", e.target.value)}
              placeholder="noreply@attendance.com"
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-900 text-sm">
              SMTP Password
            </label>
            <input
              type="password"
              value={settings.smtpPassword || ""}
              onChange={(e) => handleChange("smtpPassword", e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use app-specific password for Gmail or other providers
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-semibold text-gray-900 text-sm">
              System Name
            </label>
            <input
              type="text"
              value={settings.systemName || "Attendance Management System"}
              onChange={(e) => handleChange("systemName", e.target.value)}
              placeholder="Attendance Management System"
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-900 text-sm">
              SMTP Username
            </label>
            <input
              type="text"
              value={settings.smtpUsername || ""}
              onChange={(e) => handleChange("smtpUsername", e.target.value)}
              placeholder="your-email@gmail.com"
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        {/* Test Email Section */}
        <div className="border-t pt-4">
          <label className="font-semibold text-gray-900 text-sm block mb-2">
            Test Email Configuration
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={testEmailAddress}
              onChange={(e) => setTestEmailAddress(e.target.value)}
              placeholder="Enter email address to test"
              className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
            />
            <button
              onClick={handleTestEmail}
              disabled={testingEmail}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testingEmail ? " Sending..." : " Send Test Email"}
            </button>
          </div>
        </div>
      </section>

      {/* Security Settings */}
      <section className="max-w-7xl mx-auto bg-white rounded-xl shadow p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
           Security Settings
        </h2>
        <p className="text-gray-600 text-sm mt-1 mb-4">
          Configure authentication and security options
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-semibold text-gray-900 text-sm">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={settings.sessionTimeout || 60}
              onChange={(e) =>
                handleChange("sessionTimeout", parseInt(e.target.value))
              }
              min={5}
              max={1440}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Session will expire after this duration of inactivity
            </p>
          </div>
          <div>
            <label className="font-semibold text-gray-900 text-sm">
              Max Login Attempts
            </label>
            <input
              type="number"
              value={settings.maxLoginAttempts || 5}
              onChange={(e) =>
                handleChange("maxLoginAttempts", parseInt(e.target.value))
              }
              min={1}
              max={10}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-semibold text-gray-900 text-sm">
              Account Lockout Duration (minutes)
            </label>
            <input
              type="number"
              value={settings.lockoutDuration || 30}
              onChange={(e) =>
                handleChange("lockoutDuration", parseInt(e.target.value))
              }
              min={5}
              max={240}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-900 text-sm">
              Minimum Password Length
            </label>
            <input
              type="number"
              value={settings.passwordMinLength || 8}
              onChange={(e) =>
                handleChange("passwordMinLength", parseInt(e.target.value))
              }
              min={6}
              max={20}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        {/* 2FA Toggle - FIXED */}
        <div className="flex items-center justify-between py-3 border-t">
          <div>
            <p className="font-medium text-gray-900">
               Two-Factor Authentication
            </p>
            <p className="text-gray-500 text-sm">
              Require 2FA for admin accounts
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.require2FA || false}
              onChange={(e) => {
                handleChange("require2FA", e.target.checked);
                console.log(" 2FA toggle changed to:", e.target.checked);
              }}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-gray-900 transition-all after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>
      </section>

      {/* Database & Backup */}
      <section className="max-w-7xl mx-auto bg-white rounded-xl shadow p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
           Database & Backup
        </h2>
        <p className="text-gray-600 text-sm mt-1 mb-4">
          Manage data backup and restoration
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b gap-2 mb-4">
          <div>
            <p className="font-medium text-gray-900">Automatic Backups</p>
            <p className="text-gray-500 text-sm">
              Enable automatic database backups
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer self-end sm:self-auto">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.automaticBackups || false}
              onChange={(e) =>
                handleChange("automaticBackups", e.target.checked)
              }
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-gray-900 transition-all after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>

        {settings.automaticBackups && (
          <div className="grid sm:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="font-semibold text-gray-900 text-sm">
                Backup Frequency
              </label>
              <select
                value={settings.backupFrequency || "daily"}
                onChange={(e) =>
                  handleChange("backupFrequency", e.target.value)
                }
                className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-gray-900 text-sm">
                Backup Time
              </label>
              <input
                type="time"
                value={settings.backupTime || "02:00"}
                onChange={(e) => handleChange("backupTime", e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-semibold text-gray-900 text-sm">
                Backup Retention (days)
              </label>
              <input
                type="number"
                value={settings.backupRetentionDays || 30}
                onChange={(e) =>
                  handleChange(
                    "backupRetentionDays",
                    parseInt(e.target.value)
                  )
                }
                min={1}
                max={365}
                className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Old backups older than this will be automatically deleted
              </p>
            </div>
          </div>
        )}

        {/* Backup Actions */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={handleCreateBackup}
            disabled={creatingBackup}
            className="border border-gray-900 text-gray-900 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creatingBackup ? " Creating..." : "Create Backup Now"}
          </button>
          <button
            onClick={() => fetchBackups()}
            className="border border-gray-900 text-gray-900 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Refresh Backups
          </button>
        </div>

        {/* Backups List */}
        {backups.length > 0 && (
          <div className="border rounded-lg overflow-hidden mb-4">
            <div className="bg-gray-50 p-4 font-semibold text-gray-900">
              Available Backups ({backups.length})
            </div>
            <div className="divide-y max-h-64 overflow-y-auto">
              {backups.map((backup, index) => (
                <div
                  key={index}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {backup.filename}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(backup.created).toLocaleString()} •{" "}
                      {(backup.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedBackup(backup.filename)}
                      className={`px-3 py-1 rounded text-sm font-semibold transition ${
                        selectedBackup === backup.filename
                          ? "bg-blue-600 text-white"
                          : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      Select
                    </button>
                    <button
                      onClick={() => handleDownloadBackup(backup.filename)}
                      className="border border-gray-900 text-gray-900 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100 transition"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restore Button */}
        {backups.length > 0 && (
          <button
            onClick={handleRestoreBackup}
            disabled={
              !selectedBackup || restoringBackup
            }
            className="w-full border-2 border-red-600 text-red-600 px-5 py-2 rounded-lg font-semibold hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {restoringBackup
              ? "Restoring..."
              : `Restore from ${selectedBackup ? "Selected Backup" : "Backup"}`}
          </button>
        )}

        {backups.length === 0 && (
          <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
            No backups available yet. Click "Create Backup Now" to create one.
          </div>
        )}

        {settings.lastBackupDate && (
          <p className="text-xs text-gray-500 mt-4">
            Last backup: {new Date(settings.lastBackupDate).toLocaleString()}
          </p>
        )}
      </section>

      {/* Save Button at Bottom */}
      <div className="max-w-7xl mx-auto flex justify-end pt-4 pb-8">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="bg-gray-900 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            "Save All Settings"
          )}
        </button>
      </div>
    </div>
  );
}