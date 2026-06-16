import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { isAuthenticated } from "@/api/request";
import { AdminShell } from "@/components/admin/AdminShell";
function AdminLayout() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading && !user && !isAuthenticated()) nav("/login");
  }, [loading, user, nav]);
  if (loading) return null;
  if (!user && !isAuthenticated()) return null;
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
export default AdminLayout;
