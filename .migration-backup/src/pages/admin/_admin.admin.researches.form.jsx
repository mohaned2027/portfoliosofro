import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UploadCloud, X, ImageIcon } from "lucide-react";
import { useAdminResearches } from "@/context/AdminDataContext";
import { api } from "@/api/client";

const INPUT =
  "w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30";
const TEXTAREA = `${INPUT} resize-none`;

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function CoverDropzone({ value, onChange }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef(null);
  const handle = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => onChange(r.result);
    r.readAsDataURL(file);
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
      className={`cursor-pointer rounded-lg border-2 border-dashed transition overflow-hidden ${drag ? "border-electric bg-electric/5" : "border-border bg-muted/20 hover:border-electric/50"}`}
    >
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handle(e.target.files?.[0])}
      />
      {value ? (
        <div className="relative aspect-video">
          <img src={value} className="w-full h-full object-cover" alt="" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="absolute top-2 right-2 grid size-7 place-items-center rounded bg-black/60 text-white hover:text-destructive"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center px-4">
          <div className="grid size-11 place-items-center rounded-full bg-electric/10 text-electric">
            <UploadCloud className="size-5" />
          </div>
          <p className="text-sm font-medium">
            Drag &amp; drop or click to browse
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <ImageIcon className="size-3" /> PNG · JPG · WEBP
          </p>
        </div>
      )}
    </div>
  );
}

const EMPTY = {
  title: "",
  excerpt: "",
  content: "",
  date: "",
  category: "",
  live_link: "",
  cover: "",
};

export default function ResearchForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const allItems = useAdminResearches() ?? [];
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isEdit) {
      setLoaded(true);
      return;
    }
    const item = allItems.find((r) => r.id === id);
    if (item) {
      setForm({
        ...EMPTY,
        ...item,
      });
      setLoaded(true);
    }
  }, [allItems, id, isEdit]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (isEdit) {
        await api.researches.update(id, payload);
      } else {
        await api.researches.create(payload);
      }
      nav("/admin/researches");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded)
    return (
      <div className="flex items-center justify-center py-32 text-muted-foreground">
        Loading…
      </div>
    );

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => nav("/admin/researches")}
          className="grid size-9 place-items-center rounded-md border border-border hover:border-electric/60 text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-display">
            {isEdit ? "Edit Research" : "New Research"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Fill in the details below
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create"}
        </button>
      </div>

      {/* Cover */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-3.5 border-b border-border">
          <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            Cover Image
          </p>
        </div>
        <div className="px-6 py-5">
          <CoverDropzone value={form.cover} onChange={(v) => set("cover", v)} />
        </div>
      </div>

      {/* Details */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-3.5 border-b border-border">
          <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            Details
          </p>
        </div>
        <div className="px-6 py-5 space-y-4">
          <Field label="Title">
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={INPUT}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Date">
              <input
                type="date"
                value={form.date?.slice(0, 10) ?? ""}
                onChange={(e) => set("date", e.target.value)}
                className={INPUT}
              />
            </Field>
            <Field label="Category">
              <input
                value={form.category ?? ""}
                onChange={(e) => set("category", e.target.value)}
                placeholder="Wireless Communications, DSP…"
                className={INPUT}
              />
            </Field>
          </div>

          <Field label="Excerpt (Short Description)">
            <textarea
              rows={3}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              className={TEXTAREA}
            />
          </Field>

          <Field label="Content (Full Description)">
            <textarea
              rows={6}
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              className={TEXTAREA}
            />
          </Field>

          <Field label="Live Link (optional)">
            <input
              type="url"
              value={form.live_link ?? ""}
              onChange={(e) => set("live_link", e.target.value)}
              placeholder="https://…"
              className={INPUT}
            />
          </Field>
        </div>
      </div>
    </form>
  );
}
