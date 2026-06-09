
import { CrudPage } from "@/components/admin/CrudPage";
import { api } from "@/api/client";

const __PageComponent = () => (
    <CrudPage
      title="Blogs"
      subtitle="Articles, essays, and short notes"
      queryKey="admin-blogs"
      api={api.blogs       }
      columns={[
        { key: "cover", label: "", render: (r     ) => <img src={r.cover} className="size-12 rounded-md object-cover" /> },
        { key: "title", label: "Title", render: (r     ) => <span className="font-medium text-foreground">{r.title}</span> },
        { key: "slug", label: "Slug", render: (r     ) => <code className="text-xs">{r.slug}</code> },
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
  );

export default __PageComponent;
