import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { api } from "@/api/client";

export const Route = createFileRoute("/_admin/admin/blogs")({
  component: () => (
    <CrudPage
      title="Blogs"
      subtitle="Articles, essays, and short notes"
      queryKey="admin-blogs"
      api={api.blogs as any}
      columns={[
        { key: "cover", label: "", render: (r: any) => <img src={r.cover} className="size-12 rounded-md object-cover" /> },
        { key: "title", label: "Title", render: (r: any) => <span className="font-medium text-foreground">{r.title}</span> },
        { key: "slug", label: "Slug", render: (r: any) => <code className="text-xs">{r.slug}</code> },
        { key: "date", label: "Date" },
      ]}
      fields={[
        { name: "title", label: "Title" },
        { name: "slug", label: "Slug" },
        { name: "excerpt", label: "Excerpt", type: "textarea" },
        { name: "content", label: "Content (Markdown)", type: "textarea" },
        { name: "cover", label: "Cover image", type: "image" },
        { name: "date", label: "Publish date", type: "date" },
      ]}
      defaults={{ title: "", slug: "", excerpt: "", content: "", date: new Date().toISOString().slice(0, 10) }}
    />
  ),
});
