import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, GraduationCap, Award, Briefcase, Quote, Mail, FileText, Sparkles, Radio, Cpu, Antenna } from "lucide-react";
import professorImg from "@/assets/professor.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import { CircuitBackground } from "@/components/effects/CircuitBackground";
import { SectionHeader } from "@/components/common/Headers";
import { CoverCard } from "@/components/common/Cards";
import { Stat } from "@/components/common/Primitives";
import { useProfessor, useCourses, useResearches, useAchievements, useBlogs, useStats } from "@/context/DataContext";

const TITLES = ["Professor of Wireless Communications", "Head of ECE Department", "Researcher in 6G & Intelligent Surfaces", "IEEE Distinguished Lecturer"];

function Typewriter() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = TITLES[i];
    const t = setTimeout(() => {
      if (!del) {
        setText(cur.slice(0, text.length + 1));
        if (text.length + 1 === cur.length) setTimeout(() => setDel(true), 1400);
      } else {
        setText(cur.slice(0, text.length - 1));
        if (text.length - 1 === 0) {
          setDel(false);
          setI((i + 1) % TITLES.length);
        }
      }
    }, del ? 30 : 60);
    return () => clearTimeout(t);
  }, [text, del, i]);
  return <span className="text-electric font-mono text-sm md:text-base">
      {text}<span className="ml-0.5 inline-block w-1.5 h-4 bg-electric animate-pulse align-middle" />
    </span>;
}

function HomePage() {
  // Use DataContext for all data
  const professor = useProfessor();
  const courses = useCourses();
  const researches = useResearches();
  const achievements = useAchievements();
  const blogs = useBlogs();
  const stats = useStats();

  // Fallback values if data is not loaded
  if (!professor || !stats) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }} />
        <CircuitBackground />
        <div className="container-academic relative grid gap-12 py-20 md:grid-cols-2 md:py-32 items-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-electric">
              <span className="size-1.5 rounded-full bg-electric animate-pulse" /> Available for Collaborations
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              {professor.name.split(" ").slice(0, 2).join(" ")}{" "}
              <span className="text-gradient-electric">{professor.name.split(" ").slice(2).join(" ")}</span>
            </h1>
            <Typewriter />
            <p className="text-muted-foreground max-w-xl">
              {professor.department} • {professor.university}. Two decades of research and teaching at the frontier of wireless systems.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/researches" className="inline-flex h-11 items-center gap-2 rounded-md bg-electric px-5 text-sm font-medium text-electric-foreground hover:opacity-90 glow-sm">
                Explore research <ArrowRight className="size-4" />
              </Link>
              <Link to="/contact" className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-medium hover:border-electric/60">
                <Mail className="size-4" /> Get in touch
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1.5"><Radio className="size-3.5 text-electric" /> 6G Research</span>
              <span className="flex items-center gap-1.5"><Antenna className="size-3.5 text-electric" /> MIMO Systems</span>
              <span className="flex items-center gap-1.5"><Cpu className="size-3.5 text-electric" /> AI for Comms</span>
            </div>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.7,
          delay: 0.2
        }} className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-electric/30 to-transparent blur-2xl" />
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-electric/30 glow">
              <img src={professorImg} alt={professor.name} width={1024} height={1024} className="size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 glass rounded-lg p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-electric">Currently</p>
                <p className="font-display text-sm font-semibold">Head of Department • Professor</p>
              </div>
            </div>
            {/* Decorative orbiting dots */}
            <div className="pointer-events-none absolute inset-0 animate-radar opacity-40">
              <span className="absolute -top-2 left-1/2 size-3 -translate-x-1/2 rounded-full bg-electric glow-sm" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="container-academic py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Stat value={`${stats.publications}+`} label="Publications" icon={<FileText className="size-4" />} />
          <Stat value={stats.courses} label="Courses" icon={<BookOpen className="size-4" />} />
          <Stat value={stats.awards} label="Awards" icon={<Award className="size-4" />} />
          <Stat value={`${stats.experience} yrs`} label="Experience" icon={<Briefcase className="size-4" />} />
          <Stat value={stats.students} label="Supervised" icon={<GraduationCap className="size-4" />} />
          <Stat value={`${(stats.citations / 1000).toFixed(1)}K`} label="Citations" icon={<Sparkles className="size-4" />} />
        </div>
      </section>

      {/* INTRO */}
      <section className="container-academic py-16">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border">
              <img src={heroBg} alt="Lab" loading="lazy" className="size-full object-cover opacity-80" />
            </div>
            <div className="absolute -bottom-6 -right-6 glass rounded-xl p-4 max-w-[260px]">
              <Quote className="size-5 text-electric mb-2" />
              <p className="text-sm italic text-muted-foreground">"The best engineers are taught to ask better questions, not just to find better answers."</p>
            </div>
          </div>
          <div className="space-y-5">
            <SectionHeader eyebrow="About the professor" title={<>A career spent at the <span className="text-gradient-electric">edge of wireless</span></>} subtitle={null} align="left" />
            <p className="text-muted-foreground">{professor.bio}</p>
            <div className="grid grid-cols-2 gap-3">
              {professor.interests?.slice(0, 4).map(i => <div key={i} className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm">
                  <span className="size-1.5 rounded-full bg-electric" /> {i}
                </div>)}
            </div>
            <Link to="/about" className="inline-flex items-center gap-1 text-sm text-electric hover:underline">
              Full biography <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* RESEARCH */}
      <section className="container-academic py-16">
        <SectionHeader eyebrow="Featured Research" title="Recent publications" subtitle="A selection of recent peer-reviewed work in wireless and signal processing." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {researches?.slice(0, 3).map(r => <CoverCard key={r.id} to={`/researches/${r.id}`} cover={r.cover} eyebrow={String(r.year)} title={r.title} meta={r.abstract} footer={r.journal} />)}
        </div>
        <div className="mt-8 text-center">
          <Link to="/researches" className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium hover:border-electric/60">
            View all research <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="container-academic py-16">
        <SectionHeader eyebrow="Recognition" title="Featured achievements" subtitle="Awards, grants, and honors received across two decades of service." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {achievements?.slice(0, 4).map(a => <CoverCard key={a.id} to={`/achievements/${a.id}`} cover={a.cover} eyebrow={a.category} title={a.title} footer={new Date(a.date).toLocaleDateString()} />)}
        </div>
      </section>

      {/* COURSES */}
      <section className="container-academic py-16">
        <SectionHeader eyebrow="Teaching" title="Featured courses" subtitle="Graduate and undergraduate offerings on wireless communications and signal processing." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses?.slice(0, 3).map(c => <CoverCard key={c.id} to={`/courses/${c.id}`} cover={c.cover} eyebrow={`${c.lectures?.length || 0} Lectures`} title={c.title} meta={c.description} />)}
        </div>
      </section>

      {/* BLOG */}
      <section className="container-academic py-16">
        <SectionHeader eyebrow="Latest Blog" title="Notes & essays" subtitle="Short writing on research, teaching, and the future of communications." />
        <div className="grid gap-5 md:grid-cols-3">
          {blogs?.slice(0, 3).map(b => <CoverCard key={b.id} to={`/blog/${b.id}`} cover={b.cover} eyebrow="Article" title={b.title} meta={b.excerpt} footer={new Date(b.date).toLocaleDateString()} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="container-academic py-20">
        <div className="relative overflow-hidden rounded-3xl border border-electric/30 bg-gradient-to-br from-card via-card to-deep p-10 md:p-14">
          <CircuitBackground />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] items-center">
            <div>
              <h3 className="font-display text-3xl md:text-4xl font-bold">Let's collaborate.</h3>
              <p className="mt-2 text-muted-foreground max-w-xl">
                Research partnerships, graduate supervision, invited talks, and editorial review.
                Reach out and let's build something meaningful together.
              </p>
            </div>
            <Link to="/contact" className="inline-flex h-12 items-center gap-2 rounded-md bg-electric px-6 text-sm font-semibold text-electric-foreground hover:opacity-90 glow-sm">
              Contact me <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>;
}

export default HomePage;
