import { CrudPage } from "@/components/admin/CrudPage";
import { api } from "@/api/client";
const __PageComponent = () => <CrudPage title="Positions" subtitle="Current academic & advisory roles" queryKey="admin-pos" api={api.positions} columns={[{
  key: "title",
  label: "Title",
  render: r => <span className="font-medium text-foreground">{r.title}</span>
}, {
  key: "organization",
  label: "Organization"
}]} fields={[{
  name: "title",
  label: "Position name"
}, {
  name: "organization",
  label: "Organization"
}, {
  name: "description",
  label: "Description",
  type: "textarea"
}]} defaults={{
  title: "",
  organization: "",
  description: "",
  icon: "academic"
}} />;
export default __PageComponent;