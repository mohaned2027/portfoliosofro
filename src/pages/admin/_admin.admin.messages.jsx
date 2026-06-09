import React, { useState } from 'react';
import { useMessages } from '../../context/DataContext';
import { useCrudOperations } from '../../hooks/useCrudOperations';
import CrudTable from '../../components/admin/CrudTable';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { DASHBOARD_ENDPOINTS } from '../../api/endpoints';

export default function AdminMessages() {
  const messages = useMessages();
  const { delete: deleteMessage, loading, error, success } = useCrudOperations(DASHBOARD_ENDPOINTS.messages.list);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'date', label: 'Date' },
  ];

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteMessage(id);
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Messages Management</h1>

        {error && <div className="p-4 bg-destructive/20 text-destructive rounded">{error}</div>}
        {success && <div className="p-4 bg-green-500/20 text-green-700 rounded">Operation successful!</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CrudTable data={messages || []} columns={columns} onEdit={setSelectedMessage} onDelete={handleDelete} loading={loading} />
          </div>

          {selectedMessage && (
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold">Message Details</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {selectedMessage.name}</p>
                <p><strong>Email:</strong> {selectedMessage.email}</p>
                <p><strong>Phone:</strong> {selectedMessage.phone}</p>
                <p><strong>Date:</strong> {selectedMessage.date}</p>
                <p><strong>Message:</strong></p>
                <p className="bg-muted p-3 rounded">{selectedMessage.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
