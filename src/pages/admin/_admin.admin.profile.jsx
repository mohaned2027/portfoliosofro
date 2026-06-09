import React, { useState, useEffect } from 'react';
import { useProfessor } from '../../context/DataContext';
import { useCrudOperations } from '../../hooks/useCrudOperations';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { DASHBOARD_ENDPOINTS } from '../../api/endpoints';

export default function AdminProfile() {
  const professor = useProfessor();
  const { update, loading, error, success } = useCrudOperations(DASHBOARD_ENDPOINTS.professor.update);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (professor) {
      setFormData(professor);
    }
  }, [professor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await update(professor?.id, formData);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-3xl font-bold">Profile Management</h1>

        {error && <div className="p-4 bg-destructive/20 text-destructive rounded">{error}</div>}
        {success && <div className="p-4 bg-green-500/20 text-green-700 rounded">Profile updated successfully!</div>}

        <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input type="tel" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <input type="text" value={formData.department || ''} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">University</label>
              <input type="text" value={formData.university || ''} onChange={(e) => setFormData({ ...formData, university: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea value={formData.bio || ''} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" rows="4" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vision</label>
            <textarea value={formData.vision || ''} onChange={(e) => setFormData({ ...formData, vision: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" rows="3" />
          </div>

          <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50">
            {loading ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
