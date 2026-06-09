
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Spinner } from "@/components/common/Primitives";
import { useTheme } from "@/context/ThemeContext";
import { confirmDelete } from "@/lib/confirm";
import { Moon, Sun, KeyRound, Save, Plus, Trash2, Globe } from "lucide-react";
import { toast } from "sonner";



const FIELD = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:border-electric focus:outline-none";

function SettingsPage() {
  const qc = useQueryClient();
  const { theme, setTheme } = useTheme();
  const { data, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: () => api.settings.get() });
  const [form, setForm] = useState     (null);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });

  useEffect(() => { if (data && !form) setForm(data); }, [data, form]);

  const save = useMutation({
    mutationFn: (p     ) => api.settings.update(p),
    onSuccess: () => { toast.success("Settings saved"); qc.invalidateQueries({ queryKey: ["admin-settings"] }); },
    onError: () => toast.error("Save failed"),
  });

  if (isLoading || !form) return <Spinner />;
  const update = (patch     ) => setForm({ ...form, ...patch });

  const setPhrase = (i        , v        ) => {
    const heroTypewriter = [...form.heroTypewriter];
    heroTypewriter[i] = v; update({ heroTypewriter });
  };
  const addPhrase = () => update({ heroTypewriter: [...form.heroTypewriter, "New phrase"] });
  const removePhrase = async (i        ) => {
    if (!(await confirmDelete("Remove this phrase?"))) return;
    update({ heroTypewriter: form.heroTypewriter.filter((_     , idx        ) => idx !== i) });
  };

  const submitPwd = (e                 ) => {
    e.preventDefault();
    if (pwd.next !== pwd.confirm) return toast.error("Passwords don't match");
    if (pwd.next.length < 8) return toast.error("Password too short (min 8)");
    toast.success("Password updated");
    setPwd({ current: "", next: "", confirm: "" });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Site Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Site-wide content, hero copy, appearance, and account.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-6">
        <section className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h2 className="font-display font-semibold flex items-center gap-2"><Globe className="size-4 text-electric" /> SEO & metadata</h2>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Site title</span>
            <input className={FIELD} value={form.siteTitle} onChange={(e) => update({ siteTitle: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Meta description</span>
            <textarea rows={2} className={FIELD} value={form.siteDescription} onChange={(e) => update({ siteDescription: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Keywords (comma separated)</span>
            <input className={FIELD} value={form.siteKeywords} onChange={(e) => update({ siteKeywords: e.target.value })} />
          </label>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h2 className="font-display font-semibold">Hero section</h2>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Hero subtitle</span>
            <input className={FIELD} value={form.heroSubtitle} onChange={(e) => update({ heroSubtitle: e.target.value })} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Primary CTA label</span>
              <input className={FIELD} value={form.heroCtaPrimary} onChange={(e) => update({ heroCtaPrimary: e.target.value })} />
            </label>
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Secondary CTA label</span>
              <input className={FIELD} value={form.heroCtaSecondary} onChange={(e) => update({ heroCtaSecondary: e.target.value })} />
            </label>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Typewriter phrases</span>
              <button type="button" onClick={addPhrase} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1 text-xs hover:border-electric/60">
                <Plus className="size-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {form.heroTypewriter.map((p        , i        ) => (
                <div key={i} className="flex items-center gap-2">
                  <input className={`${FIELD} flex-1`} value={p} onChange={(e) => setPhrase(i, e.target.value)} />
                  <button type="button" onClick={() => removePhrase(i)} className="grid size-9 place-items-center rounded-md border border-border hover:border-destructive/60 hover:text-destructive">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h2 className="font-display font-semibold">Footer & contact</h2>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Footer text</span>
            <input className={FIELD} value={form.footerText} onChange={(e) => update({ footerText: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Contact page note</span>
            <textarea rows={2} className={FIELD} value={form.contactNote} onChange={(e) => update({ contactNote: e.target.value })} />
          </label>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h2 className="font-display font-semibold">Section toggles</h2>
          {[["showStats", "Show stats section"], ["showSkills", "Show skills section"], ["showInterests", "Show interests section"]].map(([k, l]) => (
            <label key={k} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5 text-sm cursor-pointer">
              <span>{l}</span>
              <input type="checkbox" className="size-4 accent-electric" checked={  form[k]} onChange={(e) => update({ [k]: e.target.checked })} />
            </label>
          ))}
        </section>

        <button disabled={save.isPending} className="inline-flex items-center gap-2 rounded-md bg-electric px-6 py-3 text-sm font-medium text-electric-foreground hover:opacity-90 disabled:opacity-60 shadow-lg">
          <Save className="size-4" /> {save.isPending ? "Saving…" : "Save site settings"}
        </button>
      </form>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display font-semibold mb-3">Appearance</h2>
        <div className="flex gap-2">
          <button onClick={() => setTheme("dark")} className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm ${theme === "dark" ? "border-electric text-electric bg-electric/5" : "border-border"}`}>
            <Moon className="size-4" /> Dark
          </button>
          <button onClick={() => setTheme("light")} className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm ${theme === "light" ? "border-electric text-electric bg-electric/5" : "border-border"}`}>
            <Sun className="size-4" /> Light
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display font-semibold mb-3 flex items-center gap-2"><KeyRound className="size-4 text-electric" /> Change password</h2>
        <form onSubmit={submitPwd} className="space-y-3 max-w-md">
          {[["current", "Current password"], ["next", "New password"], ["confirm", "Confirm new password"]].map(([k, l]) => (
            <label key={k} className="block">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{l}</span>
              <input type="password" className={FIELD} value={(pwd       )[k]} onChange={(e) => setPwd({ ...pwd, [k]: e.target.value })} />
            </label>
          ))}
          <button className="inline-flex items-center gap-2 rounded-md bg-electric px-5 py-2 text-sm font-medium text-electric-foreground hover:opacity-90">Update password</button>
        </form>
      </section>
    </div>
  );
}

export default SettingsPage;
