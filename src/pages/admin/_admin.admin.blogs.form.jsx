import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CloudUpload as UploadCloud, Image as ImageIcon, X, Loader as Loader2 } from "lucide-react";
import { api } from "@/api/client";

function Dropzone({ value, onChange }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef(null);
  const handle = (f) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => onChange(r.result);
    r.readAsDataURL(f);
  };
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handle(e.dataTransfer.files?.[0]);
      }}
      onClick={() => ref.current?.click()}
      className={`cursor-pointer rounded-xl border-2 border-dashed transition overflow-hidden ${drag ? "border-electric bg-electric/5" : "border-border bg-muted/20 hover:border-electric/50"}`}
    >
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handle(e.target.files?.[0])}
      />
      {value ? (
        <div className="relative aspect-[21/9]">
          <img src={value} className="w-full h-full object-cover" alt="" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="absolute top-3 right-3 grid size-8 place-items-center rounded-lg bg-black/60 text-white hover:text-destructive transition"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-4">
          <div className="grid size-14 place-items-center rounded-full bg-electric/10 text-electric">
            <UploadCloud className="size-6" />
          </div>
          <p className="text-base font-medium">Drag & drop or click to browse</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <ImageIcon className="size-4" /> PNG · JPG · WEBP
          </p>
        </div>
      )}
    </div>
  );
}

const EMPTY = { title: "", excerpt: "", content: "", cover: "", date: "", category: "", slug: "" };

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(id);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.blogs.get(id).then((data) => {
        setForm(data ?? EMPTY);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
        navigate("/admin/blogs");
      });
    }
  }, [id, navigate]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.blogs.update(id, form);
      } else {
        await api.blogs.create(form);
      }
      navigate("/admin/blogs");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 text-electric animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/blogs")}
          className="grid size-10 place-items-center rounded-lg border border-border hover:bg-muted transition"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold font-display">
            {isEdit ? "Edit Post" : "New Post"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isEdit ? "Update the blog post details" : "Create a new blog post"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="space-y-6">
        {/* Title */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Title
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Enter post title..."
              className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-lg font-medium focus:outline-none focus:border-electric/60 focus:ring-2 focus:ring-electric/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Excerpt
            </label>
            <textarea
              rows={3}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Brief description for the post..."
              className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-electric/60 focus:ring-2 focus:ring-electric/20 resize-none"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Content (Markdown)
          </label>
          <textarea
            rows={16}
            required
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            placeholder="Write your post content here using markdown..."
            className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-electric/60 focus:ring-2 focus:ring-electric/20 resize-none font-mono leading-relaxed"
          />
        </div>

        {/* Meta */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Category
            </label>
            <input
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. Technology, Research..."
              className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-electric/60 focus:ring-2 focus:ring-electric/20"
            />
          </div>
          <div className="bg-card border border-border rounded-xl p-6 space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-electric/60 focus:ring-2 focus:ring-electric/20"
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-3">
          <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Cover Image
          </label>
          <Dropzone value={form.cover} onChange={(v) => set("cover", v ?? "")} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/blogs")}
            className="px-6 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            {saving && <Loader2 className="size-4 animate-spin" />}
            {saving ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
