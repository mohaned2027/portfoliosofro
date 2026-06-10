import React, { useState } from 'react';
import { useExperience } from '../../context/DataContext';
import { useCrudOperations } from '../../hooks/useCrudOperations';
import CrudTable from '../../components/admin/CrudTable';
import { DASHBOARD_ENDPOINTS } from '../../api/endpoints';

export default function AdminExperiences() {
  const experiences = useExperience();
  const { create, update, delete: deleteExperience, loading, error, success } = useCrudOperations(DASHBOARD_ENDPOINTS.experiences.list);
  const [formData, setFormData] = useState({ title: '', company: '', startDate: '', endDate: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'company', label: 'Company' },
    { key: 'startDate', label: 'Start Date' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await update(editingId, formData);
      } else {
        await create(formData);
      }
      setFormData({ title: '', company: '', startDate: '', endDate: '', description: '' });
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
        await deleteExperience(id);
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Experience Management</h1>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ title: '', company: '', startDate: '', endDate: '', description: '' }); }} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90">
            {showForm ? 'Cancel' : 'Add Experience'}
          </button>
        </div>

        {error && <div className="p-4 bg-destructive/20 text-destructive rounded">{error}</div>}
        {success && <div className="p-4 bg-green-500/20 text-green-700 rounded">Operation successful!</div>}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card p-6 rounded border space-y-4">
            <input type="text" placeholder="Job Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" required />
            <input type="text" placeholder="Company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" required />
            <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" rows="3" />
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50">
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
          </form>
        )}

        <CrudTable data={experiences || []} columns={columns} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
      </div>
    </div>
  );
}
