import { useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Briefcase } from "lucide-react";
import { useExperience } from "@/context/DataContext";
import { api } from "@/api/client";
import { confirmDelete } from "@/lib/confirm";

const EMPTY = { title: "", company: "", startDate: "", endDate: "", description: "" };

function ExpModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY, ...(initial ?? {}) });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { initial?.id ? await api.experiences.update(initial.id, form) : await api.experiences.create(form); onSaved(); }
    finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <p className="font-semibold">{initial?.id ? "Edit Experience" : "New Experience"}</p>
          <button onClick={onClose} className="grid size-7 place-items-center rounded hover:bg-muted text-muted-foreground"><X className="size-4" /></button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Job Title</label>
            <input required value={form.title} onChange={e => set("title", e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Company / Organization</label>
            <input required value={form.company} onChange={e => set("company", e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">End Date</label>
              <input type="date" value={form.endDate} onChange={e => set("endDate", e.target.value)} placeholder="Leave blank if current" className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Description</label>
            <textarea rows={3} value={form.description} onChange={e => set("description", e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 resize-none" />
          </div>
        </form>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition">Cancel</button>
          <button onClick={submit} disabled={saving} className="px-4 py-2 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition">{saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminExperiences() {
  const raw = useExperience() ?? [];
  const [items, setItems] = useState(raw);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const filtered = items.filter(e => !search || e.title?.toLowerCase().includes(search.toLowerCase()) || e.company?.toLowerCase().includes(search.toLowerCase()));
  const refresh = async () => { const res = await api.experiences.list({ pageSize: 999 }); setItems(res.data ?? []); };
  const del = async (id) => { if (!(await confirmDelete("This experience entry will be permanently deleted."))) return; await api.experiences.remove(id); setItems(p => p.filter(e => e.id !== id)); };
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div><h1 className="text-3xl font-bold font-display">Experience</h1><p className="text-sm text-muted-foreground mt-1">Work and research history</p></div>
        <button onClick={() => setModal("create")} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 transition shrink-0"><Plus className="size-4" /> New</button>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-muted/30 text-sm focus:outline-none focus:border-electric/60" /></div>
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{filtered.length} items</span>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">
            <th className="w-12 px-4 py-3" />
            <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Title</th>
            <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Company</th>
            <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Period</th>
            <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3"><div className="size-10 rounded-md bg-electric/10 border border-electric/20 flex items-center justify-center text-electric"><Briefcase className="size-4" /></div></td>
                <td className="px-4 py-3 font-medium">{item.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.company}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{item.startDate}{item.endDate ? ` — ${item.endDate}` : " — Present"}</td>
                <td className="px-4 py-3"><div className="flex items-center justify-end gap-1">
                  <button onClick={() => setModal(item)} className="grid size-8 place-items-center rounded-md hover:bg-electric/10 text-muted-foreground hover:text-electric transition"><Pencil className="size-4" /></button>
                  <button onClick={() => del(item.id)} className="grid size-8 place-items-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"><Trash2 className="size-4" /></button>
                </div></td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={5} className="text-center py-12 text-muted-foreground text-sm">No experience entries found</td></tr>}
          </tbody>
        </table>
      </div>
      {modal && <ExpModal initial={modal === "create" ? undefined : modal} onClose={() => setModal(null)} onSaved={() => { refresh(); setModal(null); }} />}
    </div>
  );
}
