import React, { useState } from 'react';
import { useCourses } from '../../context/DataContext';
import { useCrudOperations } from '../../hooks/useCrudOperations';
import CrudTable from '../../components/admin/CrudTable';
import { DASHBOARD_ENDPOINTS } from '../../api/endpoints';

export default function AdminLectures() {
  const courses = useCourses();
  const { create, update, delete: deleteLecture, loading, error, success } = useCrudOperations(DASHBOARD_ENDPOINTS.lectures.list);
  const [formData, setFormData] = useState({ title: '', courseId: '', pdf: '', videoUrl: '', date: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const allLectures = courses?.flatMap(c => c.lectures?.map(l => ({ ...l, courseTitle: c.title })) || []) || [];

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'courseTitle', label: 'Course' },
    { key: 'date', label: 'Date' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await update(editingId, formData);
      } else {
        await create(formData);
      }
      setFormData({ title: '', courseId: '', pdf: '', videoUrl: '', date: '' });
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
        await deleteLecture(id);
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Lectures Management</h1>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ title: '', courseId: '', pdf: '', videoUrl: '', date: '' }); }} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90">
            {showForm ? 'Cancel' : 'Add Lecture'}
          </button>
        </div>

        {error && <div className="p-4 bg-destructive/20 text-destructive rounded">{error}</div>}
        {success && <div className="p-4 bg-green-500/20 text-green-700 rounded">Operation successful!</div>}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card p-6 rounded border space-y-4">
            <input type="text" placeholder="Lecture Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" required />
            <select value={formData.courseId} onChange={(e) => setFormData({ ...formData, courseId: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" required>
              <option value="">Select Course</option>
              {courses?.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <input type="url" placeholder="PDF URL" value={formData.pdf} onChange={(e) => setFormData({ ...formData, pdf: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            <input type="url" placeholder="Video URL" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border rounded bg-background" />
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50">
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
          </form>
        )}

        <CrudTable data={allLectures} columns={columns} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
      </div>
    </div>
  );
}
