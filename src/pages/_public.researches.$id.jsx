import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { ArrowLeft, ExternalLink, Calendar, Tag } from "lucide-react";
import { Spinner } from "@/components/common/Primitives";
function ResearchDetail() {
  const { id } = useParams();
  const { data: r, isLoading } = useQuery({
    queryKey: ["research", id],
    queryFn: () => api.researches.get(id),
  });
  if (isLoading || !r) return <Spinner />;
  return (
    <article className="container-academic py-12">
      <Link
        to="/researches"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-electric mb-6"
      >
        <ArrowLeft className="size-4" /> Back to research
      </Link>
      <div className="max-w-4xl">
        {r.cover && (
          <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-border mb-8">
            <img src={r.cover} alt={r.title} className="size-full object-cover" />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
          {r.category && (
            <span className="rounded-full border border-electric/30 bg-electric/5 px-3 py-1 text-xs text-electric font-mono flex items-center gap-1">
              <Tag className="size-3" /> {r.category}
            </span>
          )}
          {r.date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {new Date(r.date).toLocaleDateString()}
            </span>
          )}
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{r.title}</h1>
        {r.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground">{r.excerpt}</p>
        )}
        {r.content && (
          <div className="mt-6 text-muted-foreground leading-relaxed whitespace-pre-line">
            {r.content}
          </div>
        )}
        {r.live_link && (
          <a
            href={r.live_link}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-electric px-5 py-2.5 text-sm font-medium text-electric-foreground hover:opacity-90"
          >
            View Publication <ExternalLink className="size-4" />
          </a>
        )}
        {r.gallery?.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold mb-4">Gallery</h2>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {r.gallery.map((img, i) => (
                <div key={i} className="aspect-video overflow-hidden rounded-xl border border-border">
                  <img src={img} alt="" className="size-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
export default ResearchDetail;
