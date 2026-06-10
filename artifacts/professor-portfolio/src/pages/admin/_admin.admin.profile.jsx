import { useState, useEffect, useRef } from "react";
import { Save, Camera, User } from "lucide-react";
import { useProfessor } from "@/context/DataContext";
import { api } from "@/api/client";

function Section({ title, children }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-3.5 border-b border-border">
        <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">{title}</p>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

const INPUT = "w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/30";
const TEXTAREA = `${INPUT} resize-none`;

export default function AdminProfile() {
  const professor = useProfessor();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const avatarRef = useRef(null);

  useEffect(() => { if (professor) setForm(professor); }, [professor]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setNested = (parent, k, v) => setForm(f => ({ ...f, [parent]: { ...(f[parent] ?? {}), [k]: v } }));

  const handleAvatar = (file) => {
    if (!file) return;
    const r = new FileReader(); r.onload = () => set("avatar", r.result); r.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await api.professor.update(professor?.id, form); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div><h1 className="text-3xl font-bold font-display">Profile</h1><p className="text-sm text-muted-foreground mt-1">Your academic identity and contact info</p></div>
        <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition shrink-0">
          <Save className="size-4" />{saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
      </div>

      {/* Avatar */}
      <Section title="Profile Photo">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            {form.avatar ? (
              <img src={form.avatar} alt="" className="size-20 rounded-full object-cover border-2 border-electric/30" />
            ) : (
              <div className="size-20 rounded-full bg-electric/10 border-2 border-electric/20 flex items-center justify-center text-electric"><User className="size-8" /></div>
            )}
            <button type="button" onClick={() => avatarRef.current?.click()}
              className="absolute bottom-0 right-0 grid size-7 place-items-center rounded-full bg-electric text-electric-foreground shadow-lg hover:opacity-90 transition">
              <Camera className="size-3.5" />
            </button>
            <input ref={avatarRef} type="file" accept="image/*" hidden onChange={e => handleAvatar(e.target.files?.[0])} />
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{form.name ?? "—"}</p>
            <p>{form.title ?? ""}</p>
          </div>
        </div>
      </Section>

      {/* Basic info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name"><input value={form.name ?? ""} onChange={e => set("name", e.target.value)} className={INPUT} /></Field>
          <Field label="Title / Rank"><input value={form.title ?? ""} onChange={e => set("title", e.target.value)} className={INPUT} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Department"><input value={form.department ?? ""} onChange={e => set("department", e.target.value)} className={INPUT} /></Field>
          <Field label="University"><input value={form.university ?? ""} onChange={e => set("university", e.target.value)} className={INPUT} /></Field>
        </div>
      </Section>

      {/* Contact */}
      <Section title="Contact">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email"><input type="email" value={form.email ?? ""} onChange={e => set("email", e.target.value)} className={INPUT} /></Field>
          <Field label="Phone"><input type="tel" value={form.phone ?? ""} onChange={e => set("phone", e.target.value)} className={INPUT} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Office"><input value={form.office ?? ""} onChange={e => set("office", e.target.value)} className={INPUT} /></Field>
          <Field label="Office Hours"><input value={form.officeHours ?? ""} onChange={e => set("officeHours", e.target.value)} className={INPUT} /></Field>
        </div>
        <Field label="Address"><input value={form.address ?? ""} onChange={e => set("address", e.target.value)} className={INPUT} /></Field>
      </Section>

      {/* About */}
      <Section title="About">
        <Field label="Bio">
          <textarea rows={5} value={form.bio ?? ""} onChange={e => set("bio", e.target.value)} className={TEXTAREA} />
        </Field>
        <Field label="Vision">
          <textarea rows={3} value={form.vision ?? ""} onChange={e => set("vision", e.target.value)} className={TEXTAREA} />
        </Field>
      </Section>

      {/* Socials */}
      <Section title="Social Links">
        <div className="grid grid-cols-2 gap-4">
          {["googleScholar", "researchGate", "linkedin", "orcid"].map(k => (
            <Field key={k} label={k}>
              <input value={form.socials?.[k] ?? form[k] ?? ""} onChange={e => setNested("socials", k, e.target.value)} placeholder="https://…" className={INPUT} />
            </Field>
          ))}
        </div>
      </Section>
    </form>
  );
}
