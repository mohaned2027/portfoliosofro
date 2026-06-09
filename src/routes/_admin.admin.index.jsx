import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Stat, Spinner } from "@/components/common/Primitives";
import { Award, FileText, BookOpen, MessageSquare, Video, Edit3, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
const COLORS = ["oklch(0.68 0.2 240)", "oklch(0.78 0.18 200)", "oklch(0.58 0.22 270)", "oklch(0.72 0.18 160)"];
function DashboardHome() {
  const {
    data: s,
    isLoading
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.dashboard.stats()
  });
  const {
    data: c
  } = useQuery({
    queryKey: ["admin-charts"],
    queryFn: () => api.dashboard.charts()
  });
  if (isLoading || !s || !c) return <Spinner />;
  return <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your academic portfolio at a glance.</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <Stat value={s.totalAchievements} label="Achievements" icon={<Award className="size-4" />} />
        <Stat value={s.totalResearches} label="Researches" icon={<FileText className="size-4" />} />
        <Stat value={s.totalCourses} label="Courses" icon={<BookOpen className="size-4" />} />
        <Stat value={s.totalLectures} label="Lectures" icon={<Video className="size-4" />} />
        <Stat value={s.totalBlogs} label="Blogs" icon={<Edit3 className="size-4" />} />
        <Stat value={`${s.totalMessages} (${s.unreadMessages})`} label="Messages" icon={<MessageSquare className="size-4" />} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold">Site Traffic</h3>
              <p className="text-xs text-muted-foreground">Monthly visits & content downloads</p>
            </div>
            <span className="text-xs font-mono text-electric">Last 12 months</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={c.monthlyVisits}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8
              }} />
                <Line type="monotone" dataKey="visits" stroke="var(--electric)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="downloads" stroke="oklch(0.72 0.18 160)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display font-semibold mb-1">Content Breakdown</h3>
          <p className="text-xs text-muted-foreground mb-4">By category</p>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={c.contentBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {c.contentBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend wrapperStyle={{
                fontSize: 12
              }} />
                <Tooltip contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8
              }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Activity className="size-4 text-electric" /> Recent Activity</h3>
        <div className="space-y-3">
          {c.recentActivities.map(a => <div key={a.id} className="flex items-start gap-3 text-sm">
              <span className="mt-1.5 size-2 rounded-full bg-electric glow-sm shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{a.action}</p>
                <p className="text-xs text-muted-foreground">{a.target}</p>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{a.time}</span>
            </div>)}
        </div>
      </div>
    </div>;
}
export default DashboardHome;