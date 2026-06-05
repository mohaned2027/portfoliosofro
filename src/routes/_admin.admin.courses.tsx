import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { api } from "@/api/client";

export const Route = createFileRoute("/_admin/admin/courses")({
  component: () => (
    <CrudPage
      title="Courses"
      subtitle="Course catalog and metadata. Manage lectures from the Lectures page."
      queryKey="admin-courses"
      api={api.courses as any}
      columns={[
        { key: "cover", label: "", render: (r: any) => <img src={r.cover} className="size-12 rounded-md object-cover" /> },
        { key: "title", label: "Title", render: (r: any) => <span className="font-medium text-foreground">{r.title}</span> },
        { key: "lectures", label: "Lectures", render: (r: any) => <span>{r.lectures?.length ?? 0}</span> },
      ]}
      fields={[
        { name: "title", label: "Title" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "cover", label: "Cover image", type: "image" },
      ]}
      defaults={{ title: "", description: "", lectures: [] }}
    />
  ),
});
