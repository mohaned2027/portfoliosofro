import React, { useState } from 'react';
import { useMedia } from '../../context/DataContext';
import { useCrudOperations } from '../../hooks/useCrudOperations';
import CrudTable from '../../components/admin/CrudTable';
import { DASHBOARD_ENDPOINTS } from '../../api/endpoints';

export default function AdminMedia() {
  const media = useMedia();
  const { create, update, delete: deleteMedia, loading, error, success } = useCrudOperations(DASHBOARD_ENDPOINTS.media.list);
  const [formData, setFormData] = useState({ title: '', url: '', type: '', category: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'type', label: 'Type' },
    { key: 'category', label: 'Category' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await update(editingId, formData);
      } else {
        await create(formData);
      }
      setFormData({ title: '', url: '', type: '', category: '' });
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
        await deleteMedia(id);
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Media Management</h1>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ title: '', url: '', type: '', category: '' }); }} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90">
            {showForm ? 'Cancel' : 'Add Media'}
          </button>
        </div>

        {error && <div className="p-4 bg-destructive/20 text-destructive rounded">{error}</div>}
        {success && <div className="p-4 bg-green-500/20 text-green-700 rounded">Operation successful!</div>}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card p-6 rounded border space-y-4">
            <input type="text" placeholder="Media Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" required />
            <input type="url" placeholder="Media URL" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border rounded bg-background">
              <option value="">Select Type</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
            </select>
            <input type="text" placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50">
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
          </form>
        )}

        <CrudTable data={media || []} columns={columns} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
      </div>
    </div>
  );
}
