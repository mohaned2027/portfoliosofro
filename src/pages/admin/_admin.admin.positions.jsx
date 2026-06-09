import React, { useState } from 'react';
import { usePositions } from '../../context/DataContext';
import { useCrudOperations } from '../../hooks/useCrudOperations';
import CrudTable from '../../components/admin/CrudTable';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { DASHBOARD_ENDPOINTS } from '../../api/endpoints';

export default function AdminPositions() {
  const positions = usePositions();
  const { create, update, delete: deletePosition, loading, error, success } = useCrudOperations(DASHBOARD_ENDPOINTS.positions.list);
  const [formData, setFormData] = useState({ title: '', department: '', startDate: '', endDate: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'department', label: 'Department' },
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
      setFormData({ title: '', department: '', startDate: '', endDate: '' });
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
        await deletePosition(id);
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Positions Management</h1>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ title: '', department: '', startDate: '', endDate: '' }); }} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90">
            {showForm ? 'Cancel' : 'Add Position'}
          </button>
        </div>

        {error && <div className="p-4 bg-destructive/20 text-destructive rounded">{error}</div>}
        {success && <div className="p-4 bg-green-500/20 text-green-700 rounded">Operation successful!</div>}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card p-6 rounded border space-y-4">
            <input type="text" placeholder="Position Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" required />
            <input type="text" placeholder="Department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50">
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
          </form>
        )}

        <CrudTable data={positions || []} columns={columns} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
      </div>
    </DashboardLayout>
  );
}
