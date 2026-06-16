import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { ArrowLeft, ExternalLink, Calendar, Tag } from "lucide-react";
import { Spinner } from "@/components/common/Primitives";
function CourseDetail() {
  const { id } = useParams();
  const { data: c, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => api.courses.get(id),
  });
  if (isLoading || !c) return <Spinner />;
  return (
    <article className="container-academic py-12">
      <Link
        to="/courses"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-electric mb-6"
      >
        <ArrowLeft className="size-4" /> Back to courses
      </Link>
      <div className="max-w-4xl">
        {c.cover && (
          <div className="aspect-[21/9] overflow-hidden rounded-2xl border border-border mb-8">
            <img
              src={c.cover}
              alt={c.title}
              className="size-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
          {c.category && (
            <span className="rounded-full border border-electric/30 bg-electric/5 px-3 py-1 text-xs text-electric font-mono flex items-center gap-1">
              <Tag className="size-3" /> {c.category}
            </span>
          )}
          {c.date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {new Date(c.date).toLocaleDateString()}
            </span>
          )}
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
          {c.title}
        </h1>
        {c.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground">{c.excerpt}</p>
        )}
        {c.content && (
          <div className="mt-6 text-muted-foreground leading-relaxed whitespace-pre-line">
            {c.content}
          </div>
        )}
        {c.live_link && (
          <a
            href={c.live_link}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-electric px-5 py-2.5 text-sm font-medium text-electric-foreground hover:opacity-90"
          >
            View Course <ExternalLink className="size-4" />
          </a>
        )}
        {c.gallery?.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold mb-4">Gallery</h2>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {c.gallery.map((img, i) => (
                <div
                  key={i}
                  className="aspect-video overflow-hidden rounded-xl border border-border"
                >
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
export default CourseDetail;
