import { useState, useRef } from "react";
import { Plus, Search, Pencil, Trash2, X, UploadCloud, ImageIcon } from "lucide-react";
import { useAchievements } from "@/context/DataContext";
import { api } from "@/api/client";
import { confirmDelete } from "@/lib/confirm";

function Dropzone({ value, onChange }) {
  const [drag, setDrag] = useState(false);
  const input = useRef(null);
  const handle = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files?.[0]); }}
      onClick={() => input.current?.click()}
      className={`cursor-pointer rounded-lg border-2 border-dashed transition overflow-hidden
        ${drag ? "border-electric bg-electric/5" : "border-border bg-muted/20 hover:border-electric/50"}`}
    >
      <input ref={input} type="file" accept="image/*" hidden onChange={e => handle(e.target.files?.[0])} />
      {value ? (
        <div className="relative aspect-video">
          <img src={value} className="w-full h-full object-cover" alt="" />
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onChange(undefined); }}
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
          <p className="text-sm font-medium">Drag &amp; drop an image, or click to browse</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <ImageIcon className="size-3" /> PNG · JPG · WEBP · up to 5MB
          </p>
        </div>
      )}
    </div>
  );
}

const EMPTY = { title: "", shortDescription: "", fullDescription: "", cover: "", date: "", category: "" };

function AchievementModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...(initial ?? {}),
    shortDescription: initial?.description ?? initial?.shortDescription ?? "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        description: form.shortDescription,
      };
      if (initial?.id) {
        await api.achievements.update(initial.id, payload);
      } else {
        await api.achievements.create(payload);
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <p className="font-semibold">{initial?.id ? "Edit Achievement" : "Create Achievement"}</p>
          <button
            type="button"
            onClick={onClose}
            className="grid size-7 place-items-center rounded hover:bg-muted text-muted-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={submit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Title</label>
            <input
              required
              value={form.title}
              onChange={e => set("title", e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Short Description</label>
            <textarea
              rows={3}
              value={form.shortDescription}
              onChange={e => set("shortDescription", e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Full Description</label>
            <textarea
              rows={4}
              value={form.fullDescription}
              onChange={e => set("fullDescription", e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Cover Image</label>
            <Dropzone value={form.cover} onChange={v => set("cover", v ?? "")} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => set("date", e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Category</label>
            <input
              value={form.category}
              onChange={e => set("category", e.target.value)}
              placeholder="e.g. Award, Grant, Patent…"
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminAchievements() {
  const rawData = useAchievements() ?? [];
  const [items, setItems]   = useState(rawData);
  const [search, setSearch] = useState("");
  const [modal, setModal]   = useState(null); // null | "create" | achievement obj

  const filtered = items.filter(a =>
    !search || a.title?.toLowerCase().includes(search.toLowerCase())
  );

  const refresh = async () => {
    const res = await api.achievements.list({ pageSize: 999 });
    setItems(res.data ?? []);
  };

  const handleDelete = async (id) => {
    const ok = await confirmDelete("This achievement will be permanently deleted.");
    if (!ok) return;
    await api.achievements.remove(id);
    setItems(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Achievements</h1>
          <p className="text-sm text-muted-foreground mt-1">Awards, honors, grants, patents</p>
        </div>
        <button
          onClick={() => setModal("create")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 transition shrink-0"
        >
          <Plus className="size-4" /> New
        </button>
      </div>

      {/* Search + count */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-muted/30 text-sm focus:outline-none focus:border-electric/60"
          />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          {filtered.length} items
        </span>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="w-16 px-4 py-3" />
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Title</th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors">
                {/* Thumbnail */}
                <td className="px-4 py-3">
                  {item.cover ? (
                    <img
                      src={item.cover}
                      alt=""
                      className="size-10 rounded-md object-cover border border-border"
                    />
                  ) : (
                    <div className="size-10 rounded-md bg-muted border border-border flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="size-4" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{item.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.date}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setModal(item)}
                      className="grid size-8 place-items-center rounded-md hover:bg-electric/10 text-muted-foreground hover:text-electric transition"
                      title="Edit"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="grid size-8 place-items-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                  No achievements found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <AchievementModal
          initial={modal === "create" ? undefined : modal}
          onClose={() => setModal(null)}
          onSaved={() => { refresh(); setModal(null); }}
        />
      )}
    </div>
  );
}
