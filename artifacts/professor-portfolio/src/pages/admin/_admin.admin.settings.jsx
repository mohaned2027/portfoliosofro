import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { useSettings } from "@/context/DataContext";
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

export default function AdminSettings() {
  const settings = useSettings();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (settings) setForm(settings); }, [settings]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setArr = (k, val) => setForm(f => ({ ...f, [k]: val.split("\n").filter(Boolean) }));

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await api.settings.update(form); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div><h1 className="text-3xl font-bold font-display">Settings</h1><p className="text-sm text-muted-foreground mt-1">Site-wide configuration and content</p></div>
        <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric text-electric-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition shrink-0">
          <Save className="size-4" />{saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
      </div>

      <Section title="SEO & Metadata">
        <Field label="Site Title"><input value={form.siteTitle ?? ""} onChange={e => set("siteTitle", e.target.value)} className={INPUT} /></Field>
        <Field label="Site Description"><textarea rows={2} value={form.siteDescription ?? ""} onChange={e => set("siteDescription", e.target.value)} className={TEXTAREA} /></Field>
        <Field label="Keywords (comma-separated)"><input value={form.siteKeywords ?? ""} onChange={e => set("siteKeywords", e.target.value)} className={INPUT} /></Field>
      </Section>

      <Section title="Hero Section">
        <Field label="Subtitle"><input value={form.heroSubtitle ?? ""} onChange={e => set("heroSubtitle", e.target.value)} className={INPUT} /></Field>
        <Field label="Typewriter Lines (one per line)">
          <textarea rows={5} value={Array.isArray(form.heroTypewriter) ? form.heroTypewriter.join("\n") : (form.heroTypewriter ?? "")} onChange={e => setArr("heroTypewriter", e.target.value)} className={TEXTAREA} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary CTA"><input value={form.heroCtaPrimary ?? ""} onChange={e => set("heroCtaPrimary", e.target.value)} className={INPUT} /></Field>
          <Field label="Secondary CTA"><input value={form.heroCtaSecondary ?? ""} onChange={e => set("heroCtaSecondary", e.target.value)} className={INPUT} /></Field>
        </div>
      </Section>

      <Section title="Footer">
        <Field label="Footer Text"><input value={form.footerText ?? ""} onChange={e => set("footerText", e.target.value)} className={INPUT} /></Field>
      </Section>

      <Section title="Maintenance">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            onClick={() => set("maintenanceMode", !form.maintenanceMode)}
            className={`relative w-10 h-6 rounded-full transition ${form.maintenanceMode ? "bg-electric" : "bg-muted"}`}
          >
            <span className={`absolute top-1 size-4 rounded-full bg-white shadow transition-transform ${form.maintenanceMode ? "translate-x-5" : "translate-x-1"}`} />
          </div>
          <div>
            <p className="text-sm font-medium">Maintenance Mode</p>
            <p className="text-xs text-muted-foreground">Visitors will see a "coming soon" page</p>
          </div>
        </label>
      </Section>
    </form>
  );
}
