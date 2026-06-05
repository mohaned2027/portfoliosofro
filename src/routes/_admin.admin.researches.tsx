import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { api } from "@/api/client";

export const Route = createFileRoute("/_admin/admin/researches")({
  component: () => (
    <CrudPage
      title="Researches"
      subtitle="Publications, journal articles, conference papers"
      queryKey="admin-res"
      api={api.researches as any}
      columns={[
        { key: "title", label: "Title", render: (r: any) => <span className="font-medium text-foreground line-clamp-1">{r.title}</span> },
        { key: "year", label: "Year" },
        { key: "journal", label: "Journal" },
        { key: "doi", label: "DOI", render: (r: any) => <span className="font-mono text-xs">{r.doi}</span> },
      ]}
      fields={[
        { name: "title", label: "Title" },
        { name: "year", label: "Publication year", type: "number" },
        { name: "abstract", label: "Abstract", type: "textarea" },
        { name: "journal", label: "Journal" },
        { name: "doi", label: "DOI" },
        { name: "link", label: "Publication link", type: "url" },
        { name: "cover", label: "Cover image", type: "image" },
      ]}
      defaults={{ title: "", year: new Date().getFullYear(), abstract: "" }}
    />
  ),
});
