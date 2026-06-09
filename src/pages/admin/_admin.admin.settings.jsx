import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/DataContext';
import { useCrudOperations } from '../../hooks/useCrudOperations';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { DASHBOARD_ENDPOINTS } from '../../api/endpoints';

export default function AdminSettings() {
  const settings = useSettings();
  const { update, loading, error, success } = useCrudOperations(DASHBOARD_ENDPOINTS.settings.update);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await update('settings', formData);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-3xl font-bold">Site Settings</h1>

        {error && <div className="p-4 bg-destructive/20 text-destructive rounded">{error}</div>}
        {success && <div className="p-4 bg-green-500/20 text-green-700 rounded">Settings updated successfully!</div>}

        <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Site Title</label>
            <input type="text" value={formData.siteTitle || ''} onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Site Description</label>
            <textarea value={formData.siteDescription || ''} onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" rows="3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <input type="color" value={formData.primaryColor || '#000000'} onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Secondary Color</label>
              <input type="color" value={formData.secondaryColor || '#ffffff'} onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.maintenanceMode || false} onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })} className="rounded" />
              <span className="text-sm font-medium">Maintenance Mode</span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
