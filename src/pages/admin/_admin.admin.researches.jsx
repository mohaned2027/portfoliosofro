import React, { useState } from 'react';
import { useResearches } from '../../context/DataContext';
import { useCrudOperations } from '../../hooks/useCrudOperations';
import CrudTable from '../../components/admin/CrudTable';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { DASHBOARD_ENDPOINTS } from '../../api/endpoints';

export default function AdminResearches() {
  const researches = useResearches();
  const { create, update, delete: deleteResearch, loading, error, success } = useCrudOperations(DASHBOARD_ENDPOINTS.researches.list);
  const [formData, setFormData] = useState({ title: '', description: '', authors: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'year', label: 'Year' },
    { key: 'status', label: 'Status' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await update(editingId, formData);
      } else {
        await create(formData);
      }
      setFormData({ title: '', description: '', authors: '' });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEdit = (research) => {
    setFormData(research);
    setEditingId(research.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteResearch(id);
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Researches Management</h1>
          <button 
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ title: '', description: '', authors: '' });
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
          >
            {showForm ? 'Cancel' : 'Add Research'}
          </button>
        </div>

        {error && <div className="p-4 bg-destructive/20 text-destructive rounded">{error}</div>}
        {success && <div className="p-4 bg-green-500/20 text-green-700 rounded">Operation successful!</div>}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card p-6 rounded border space-y-4">
            <input
              type="text"
              placeholder="Research Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded bg-background"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded bg-background"
              rows="4"
            />
            <input
              type="text"
              placeholder="Authors"
              value={formData.authors}
              onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
              className="w-full px-3 py-2 border rounded bg-background"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
          </form>
        )}

        <CrudTable 
          data={researches || []} 
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}
