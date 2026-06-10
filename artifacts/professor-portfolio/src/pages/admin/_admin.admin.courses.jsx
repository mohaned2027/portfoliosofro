import React, { useState, useEffect } from 'react';
import { useCourses } from '../../context/DataContext';
import { useCrudOperations } from '../../hooks/useCrudOperations';
import CrudTable from '../../components/admin/CrudTable';
import { DASHBOARD_ENDPOINTS } from '../../api/endpoints';

export default function AdminCourses() {
  const courses = useCourses();
  const { create, update, delete: deleteCourse, loading, error, success } = useCrudOperations(DASHBOARD_ENDPOINTS.courses.list);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description', render: (val) => val?.substring(0, 50) + '...' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await update(editingId, formData);
      } else {
        await create(formData);
      }
      setFormData({ title: '', description: '' });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEdit = (course) => {
    setFormData(course);
    setEditingId(course.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteCourse(id);
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Courses Management</h1>
          <button 
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ title: '', description: '' });
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
          >
            {showForm ? 'Cancel' : 'Add Course'}
          </button>
        </div>

        {error && <div className="p-4 bg-destructive/20 text-destructive rounded">{error}</div>}
        {success && <div className="p-4 bg-green-500/20 text-green-700 rounded">Operation successful!</div>}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card p-6 rounded border space-y-4">
            <input
              type="text"
              placeholder="Course Title"
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
          data={courses || []} 
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  );
}
