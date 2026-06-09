import { PageHeader } from "@/components/common/Headers";
import { professor, education } from "@/data/mockData";
import professorImg from "@/assets/professor.jpg";
import { motion } from "framer-motion";
import { GraduationCap, Target, Sparkles, BookMarked } from "lucide-react";
function AboutPage() {
  return <>
      <PageHeader eyebrow="About" title="Biography & academic journey" subtitle="Two decades at the intersection of teaching, research, and academic leadership in communications engineering." />

      <section className="container-academic grid gap-12 py-16 md:grid-cols-[1fr_2fr]">
        <div>
          <div className="sticky top-24 space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl border border-border">
              <img src={professorImg} alt={professor.name} className="size-full object-cover" />
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-sm">
              <p className="font-display font-semibold">{professor.name}</p>
              <p className="text-muted-foreground">{professor.title}</p>
              <p className="mt-2 text-xs text-muted-foreground">{professor.email}</p>
              <p className="text-xs text-muted-foreground">{professor.office}</p>
            </div>
          </div>
        </div>
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-2xl font-bold mb-3">Biography</h2>
            <p className="text-muted-foreground leading-relaxed">{professor.bio}</p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Prior to his current role, he held positions at Imperial College London and was a visiting scholar at MIT.
              His research has been funded by the Egyptian Science Fund, the European Commission, and major industry partners
              including Vodafone and Huawei.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2"><GraduationCap className="text-electric" /> Education</h2>
            <div className="space-y-3">
              {education.map(e => <motion.div key={e.id} initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} className="rounded-xl border border-border bg-card p-4 hover:border-electric/40 transition">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-display font-semibold">{e.degree}</p>
                    <p className="font-mono text-xs text-electric">{e.year}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{e.school}</p>
                  <p className="text-xs text-muted-foreground mt-1">Focus: {e.focus}</p>
                </motion.div>)}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2"><Target className="text-electric" /> Research Interests</h2>
            <div className="flex flex-wrap gap-2">
              {professor.interests.map(i => <span key={i} className="rounded-full border border-electric/30 bg-electric/5 px-3 py-1.5 text-sm text-electric">{i}</span>)}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2"><BookMarked className="text-electric" /> Technical Skills</h2>
            <div className="space-y-3">
              {professor.skills.map(s => <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{s.name}</span>
                    <span className="font-mono text-electric">{s.level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div initial={{
                  width: 0
                }} whileInView={{
                  width: `${s.level}%`
                }} viewport={{
                  once: true
                }} transition={{
                  duration: 1
                }} className="h-full bg-gradient-to-r from-electric to-primary" />
                  </div>
                </div>)}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-3 flex items-center gap-2"><Sparkles className="text-electric" /> Vision</h2>
            <p className="text-muted-foreground leading-relaxed italic border-l-2 border-electric pl-4">"{professor.vision}"</p>
          </section>
        </div>
      </section>
    </>;
}
export default AboutPage;