import { CrudPage } from "@/components/admin/CrudPage";
import { api } from "@/api/client";
const __PageComponent = () => <CrudPage title="Education" subtitle="Degrees and academic background" queryKey="admin-edu" api={api.education} columns={[{
  key: "degree",
  label: "Degree",
  render: r => <span className="font-medium text-foreground">{r.degree}</span>
}, {
  key: "school",
  label: "Institution"
}, {
  key: "year",
  label: "Year"
}]} fields={[{
  name: "degree",
  label: "Degree"
}, {
  name: "school",
  label: "Institution"
}, {
  name: "year",
  label: "Year"
}, {
  name: "focus",
  label: "Focus / thesis",
  type: "textarea"
}]} defaults={{
  degree: "",
  school: "",
  year: "",
  focus: ""
}} />;
export default __PageComponent;