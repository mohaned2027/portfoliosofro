import React, { useState } from 'react';
import { useEducation } from '../../context/DataContext';
import { useCrudOperations } from '../../hooks/useCrudOperations';
import CrudTable from '../../components/admin/CrudTable';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { DASHBOARD_ENDPOINTS } from '../../api/endpoints';

export default function AdminEducation() {
  const education = useEducation();
  const { create, update, delete: deleteEducation, loading, error, success } = useCrudOperations(DASHBOARD_ENDPOINTS.education.list);
  const [formData, setFormData] = useState({ degree: '', institution: '', year: '', field: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'degree', label: 'Degree' },
    { key: 'institution', label: 'Institution' },
    { key: 'year', label: 'Year' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await update(editingId, formData);
      } else {
        await create(formData);
      }
      setFormData({ degree: '', institution: '', year: '', field: '' });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteEducation(id);
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Education Management</h1>
          <button 
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ degree: '', institution: '', year: '', field: '' });
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
          >
            {showForm ? 'Cancel' : 'Add Education'}
          </button>
        </div>

        {error && <div className="p-4 bg-destructive/20 text-destructive rounded">{error}</div>}
        {success && <div className="p-4 bg-green-500/20 text-green-700 rounded">Operation successful!</div>}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card p-6 rounded border space-y-4">
            <input type="text" placeholder="Degree" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" required />
            <input type="text" placeholder="Institution" value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" required />
            <input type="text" placeholder="Field" value={formData.field} onChange={(e) => setFormData({ ...formData, field: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            <input type="number" placeholder="Year" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50">
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
          </form>
        )}

        <CrudTable data={education || []} columns={columns} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
      </div>
    </DashboardLayout>
  );
}
