
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Spinner } from "@/components/common/Primitives";
import { Dropzone } from "@/components/common/Dropzone";
import { confirmDelete } from "@/lib/confirm";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";



const FIELD = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:border-electric focus:outline-none";

function ProfilePage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-prof"], queryFn: () => api.professor.get() });
  const [form, setForm] = useState     (null);
  useEffect(() => { if (data && !form) setForm(data); }, [data, form]);

  const save = useMutation({
    mutationFn: (p     ) => api.professor.update(p),
    onSuccess: () => { toast.success("Profile updated"); qc.invalidateQueries({ queryKey: ["admin-prof"] }); },
    onError: () => toast.error("Save failed"),
  });

  if (isLoading || !form) return <Spinner />;

  const update = (patch              ) => setForm({ ...form, ...patch });

  const setSkill = (i        , patch     ) => {
    const skills = [...form.skills];
    skills[i] = { ...skills[i], ...patch };
    update({ skills });
  };
  const addSkill = () => update({ skills: [...form.skills, { name: "New skill", level: 70 }] });
  const removeSkill = async (i        ) => {
    if (!(await confirmDelete("Remove this skill?"))) return;
    update({ skills: form.skills.filter((_     , idx        ) => idx !== i) });
  };

  const setInterest = (i        , v        ) => {
    const interests = [...form.interests];
    interests[i] = v;
    update({ interests });
  };
  const addInterest = () => update({ interests: [...form.interests, "New interest"] });
  const removeInterest = async (i        ) => {
    if (!(await confirmDelete("Remove this interest?"))) return;
    update({ interests: form.interests.filter((_     , idx        ) => idx !== i) });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Everything visible on the public site about you.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-6">
        <section className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="font-display font-semibold">Avatar</h2>
          <Dropzone value={form.avatar} onChange={(v) => update({ avatar: v ?? "" })} label="Drop or pick a profile photo" />
        </section>

        <section className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h2 className="font-display font-semibold">Personal information</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["name", "Full name"], ["title", "Academic title"], ["department", "Department"],
              ["university", "University"], ["email", "Email"], ["phone", "Phone"],
              ["office", "Office"], ["officeHours", "Office hours"], ["address", "Address"],
            ].map(([k, l]) => (
              <label key={k} className="block">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{l}</span>
                <input className={FIELD} value={form[k] ?? ""} onChange={(e) => update({ [k]: e.target.value })} />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h2 className="font-display font-semibold">About</h2>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Biography</span>
            <textarea rows={5} className={FIELD} value={form.bio} onChange={(e) => update({ bio: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Vision</span>
            <textarea rows={3} className={FIELD} value={form.vision} onChange={(e) => update({ vision: e.target.value })} />
          </label>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Skills</h2>
            <button type="button" onClick={addSkill} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-electric/60">
              <Plus className="size-3" /> Add skill
            </button>
          </div>
          <div className="space-y-2">
            {form.skills.map((s     , i        ) => (
              <div key={i} className="flex items-center gap-2 rounded-md border border-border bg-background p-2">
                <GripVertical className="size-4 text-muted-foreground" />
                <input className={`${FIELD} flex-1`} value={s.name} onChange={(e) => setSkill(i, { name: e.target.value })} />
                <input type="number" min={0} max={100} className="w-20 rounded-md border border-input bg-card px-2 py-2 text-sm text-center"
                  value={s.level} onChange={(e) => setSkill(i, { level: Number(e.target.value) })} />
                <span className="text-xs text-muted-foreground w-6">%</span>
                <button type="button" onClick={() => removeSkill(i)} className="grid size-9 place-items-center rounded-md border border-border hover:border-destructive/60 hover:text-destructive">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Research interests</h2>
            <button type="button" onClick={addInterest} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-electric/60">
              <Plus className="size-3" /> Add interest
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.interests.map((it        , i        ) => (
              <div key={i} className="inline-flex items-center gap-1 rounded-md border border-border bg-background pl-3 pr-1 py-1">
                <input className="bg-transparent text-sm outline-none w-44" value={it} onChange={(e) => setInterest(i, e.target.value)} />
                <button type="button" onClick={() => removeInterest(i)} className="grid size-6 place-items-center rounded hover:bg-muted text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h2 className="font-display font-semibold">Social links</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(form.socials ?? {}).map(([k, v]) => (
              <label key={k} className="block">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{k}</span>
                <input className={FIELD} value={v as string} onChange={(e) => update({ socials: { ...form.socials, [k]: e.target.value } })} />
              </label>
            ))}
          </div>
        </section>

        <div className="sticky bottom-4 z-10">
          <button disabled={save.isPending} className="inline-flex items-center gap-2 rounded-md bg-electric px-6 py-3 text-sm font-medium text-electric-foreground hover:opacity-90 disabled:opacity-60 shadow-lg">
            <Save className="size-4" /> {save.isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;
