import { CrudPage } from "@/components/admin/CrudPage";
import { api } from "@/api/client";
const __PageComponent = () => <CrudPage title="Achievements" subtitle="Awards, honors, grants, patents" queryKey="admin-ach" api={api.achievements} columns={[{
  key: "cover",
  label: "",
  render: r => <img src={r.cover} className="size-12 rounded-md object-cover" />
}, {
  key: "title",
  label: "Title",
  render: r => <span className="font-medium text-foreground">{r.title}</span>
}, {
  key: "category",
  label: "Category"
}, {
  key: "date",
  label: "Date"
}]} fields={[{
  name: "title",
  label: "Title"
}, {
  name: "description",
  label: "Short description",
  type: "textarea"
}, {
  name: "fullDescription",
  label: "Full description",
  type: "textarea"
}, {
  name: "cover",
  label: "Cover image",
  type: "image"
}, {
  name: "date",
  label: "Date",
  type: "date"
}, {
  name: "category",
  label: "Category"
}, {
  name: "liveLink",
  label: "Live link (optional)",
  type: "url"
}]} defaults={{
  title: "",
  description: "",
  category: "Award",
  date: new Date().toISOString().slice(0, 10)
}} />;
export default __PageComponent;