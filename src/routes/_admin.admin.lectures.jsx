import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Spinner } from "@/components/common/Primitives";
import { Video, FileText } from "lucide-react";
function LecturesPage() {
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-lectures"],
    queryFn: () => api.courses.list({
      pageSize: 50
    })
  });
  if (isLoading || !data) return <Spinner />;
  return <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Lectures</h1>
        <p className="text-sm text-muted-foreground mt-1">All lectures grouped by course. Open a course to add/edit lectures inline.</p>
      </div>
      <div className="grid gap-4">
        {data.data.map(c => <div key={c.id} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
              <img src={c.cover} className="size-10 rounded-md object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.lectures.length} lectures</p>
              </div>
            </div>
            <ul className="divide-y divide-border">
              {c.lectures.map(l => <li key={l.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <span className="grid size-8 place-items-center rounded-md bg-electric/10 text-electric border border-electric/30"><FileText className="size-3.5" /></span>
                  <span className="flex-1 truncate">{l.title}</span>
                  <span className="text-xs text-muted-foreground font-mono">{l.date}</span>
                  {l.videoUrl && <span className="text-xs text-electric flex items-center gap-1"><Video className="size-3" /> Video</span>}
                </li>)}
            </ul>
          </div>)}
      </div>
    </div>;
}
export default LecturesPage;