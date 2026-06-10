import React, { useState } from 'react';
import { useProfessor, useCourses, useResearches, useAchievements, useStats, useBlogs, useEducation, useExperience, usePositions } from '../../context/DataContext';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, BookOpen, Award, FileText, Activity, Settings } from 'lucide-react';

export default function DashboardHome() {
  const professor = useProfessor();
  const courses = useCourses();
  const researches = useResearches();
  const achievements = useAchievements();
  const stats = useStats();
  const blogs = useBlogs();
  const education = useEducation();
  const experience = useExperience();
  const positions = usePositions();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate analytics
  const analytics = {
    totalItems: (courses?.length || 0) + (researches?.length || 0) + (achievements?.length || 0) + (blogs?.length || 0),
    avgCoursesPerYear: courses?.length ? Math.round(courses.length / 5) : 0,
    researchGrowth: researches?.length ? Math.round((researches.length / stats?.publications) * 100) : 0,
    achievementRate: achievements?.length ? Math.round((achievements.length / (stats?.awards || 1)) * 100) : 0,
  };

  // Data for charts
  const contentDistribution = [
    { name: 'Courses', value: courses?.length || 0, color: '#3b82f6' },
    { name: 'Research', value: researches?.length || 0, color: '#10b981' },
    { name: 'Achievements', value: achievements?.length || 0, color: '#f59e0b' },
    { name: 'Blogs', value: blogs?.length || 0, color: '#8b5cf6' },
  ];

  const monthlyActivity = [
    { month: 'Jan', publications: 8, courses: 2, achievements: 1 },
    { month: 'Feb', publications: 12, courses: 3, achievements: 2 },
    { month: 'Mar', publications: 10, courses: 2, achievements: 1 },
    { month: 'Apr', publications: 15, courses: 4, achievements: 3 },
    { month: 'May', publications: 13, courses: 3, achievements: 2 },
    { month: 'Jun', publications: 18, courses: 5, achievements: 4 },
  ];

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-card border rounded-lg p-6 space-y-2 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="size-4 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {trend && <p className="text-xs text-green-600 flex items-center gap-1"><TrendingUp className="size-3" /> {trend}</p>}
    </div>
  );

  const DataTable = ({ title, data, columns }) => (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              {columns.map(col => (
                <th key={col} className="text-left py-2 px-3 font-medium text-muted-foreground">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.slice(0, 5).map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-muted/50 transition">
                <td className="py-3 px-3">{item.title || item.name}</td>
                <td className="py-3 px-3">{item.date || item.year || '-'}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    {item.status || 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Welcome back, {professor?.name?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground mt-2">{professor?.title}</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium transition ${activeTab === 'overview' ? 'border-b-2 border-electric text-electric' : 'text-muted-foreground'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 font-medium transition ${activeTab === 'analytics' ? 'border-b-2 border-electric text-electric' : 'text-muted-foreground'}`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`px-4 py-2 font-medium transition ${activeTab === 'data' ? 'border-b-2 border-electric text-electric' : 'text-muted-foreground'}`}
        >
          Data Management
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Courses" 
              value={courses?.length || 0}
              icon={BookOpen}
              trend={`+${analytics.avgCoursesPerYear} per year`}
              color="bg-blue-500"
            />
            <StatCard 
              title="Researches" 
              value={researches?.length || 0}
              icon={FileText}
              trend={`${analytics.researchGrowth}% of publications`}
              color="bg-green-500"
            />
            <StatCard 
              title="Achievements" 
              value={achievements?.length || 0}
              icon={Award}
              trend={`${analytics.achievementRate}% completion`}
              color="bg-amber-500"
            />
            <StatCard 
              title="Total Content" 
              value={analytics.totalItems}
              icon={Activity}
              trend={`${blogs?.length || 0} blog posts`}
              color="bg-purple-500"
            />
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Summary */}
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold">Profile Summary</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {professor?.email}</p>
                <p><strong>Phone:</strong> {professor?.phone}</p>
                <p><strong>Department:</strong> {professor?.department}</p>
                <p><strong>University:</strong> {professor?.university}</p>
              </div>
            </div>

            {/* Recent Stats */}
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold">Statistics</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Publications:</strong> {stats?.publications || 0}</p>
                <p><strong>Courses:</strong> {stats?.courses || 0}</p>
                <p><strong>Students Supervised:</strong> {stats?.students || 0}</p>
                <p><strong>Research Areas:</strong> {stats?.researchAreas || 0}</p>
              </div>
            </div>
          </div>

          {/* Recent Courses */}
          <div className="bg-card border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">Recent Courses</h2>
            <div className="space-y-2">
              {(courses || []).slice(0, 3).map(course => (
                <div key={course.id} className="p-3 bg-muted rounded flex justify-between items-center">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-xs text-muted-foreground">{course.description?.substring(0, 50)}...</p>
                  </div>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    {course.lectures?.length || 0} lectures
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Distribution Pie Chart */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Content Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={contentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {contentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Activity Line Chart */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="publications" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="courses" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="achievements" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart - Comparative Analysis */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Content Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="publications" fill="#10b981" />
                <Bar dataKey="courses" fill="#3b82f6" />
                <Bar dataKey="achievements" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* DATA MANAGEMENT TAB */}
      {activeTab === 'data' && (
        <div className="space-y-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> All changes to the data below will be reflected across the entire website. Edit the JSON files in the mockData folder or connect to a real API to persist changes.
            </p>
          </div>

          {/* Data Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataTable 
              title="Courses" 
              data={courses}
              columns={['Title', 'Date', 'Status']}
            />
            <DataTable 
              title="Research Publications" 
              data={researches}
              columns={['Title', 'Year', 'Status']}
            />
            <DataTable 
              title="Achievements" 
              data={achievements}
              columns={['Title', 'Date', 'Status']}
            />
            <DataTable 
              title="Blog Posts" 
              data={blogs}
              columns={['Title', 'Date', 'Status']}
            />
          </div>

          {/* Raw Data Editor */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats Editor</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Publications</label>
                <input 
                  type="number" 
                  defaultValue={stats?.publications || 0}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-muted"
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-medium">Courses</label>
                <input 
                  type="number" 
                  defaultValue={stats?.courses || 0}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-muted"
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-medium">Awards</label>
                <input 
                  type="number" 
                  defaultValue={stats?.awards || 0}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-muted"
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-medium">Experience (years)</label>
                <input 
                  type="number" 
                  defaultValue={stats?.experience || 0}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-muted"
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-medium">Students Supervised</label>
                <input 
                  type="number" 
                  defaultValue={stats?.students || 0}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-muted"
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-medium">Citations</label>
                <input 
                  type="number" 
                  defaultValue={stats?.citations || 0}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-muted"
                  disabled
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              📝 To edit these values, modify the <code className="bg-muted px-2 py-1 rounded">src/api/mockData/stats.json</code> file
            </p>
          </div>

          {/* Data Source Info */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Data Source Configuration</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-3 bg-muted rounded">
                <span className="text-2xl">📁</span>
                <div>
                  <p className="font-medium">Mock Data Location</p>
                  <p className="text-muted-foreground">src/api/mockData/</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded">
                <span className="text-2xl">🔄</span>
                <div>
                  <p className="font-medium">Data Service</p>
                  <p className="text-muted-foreground">src/api/request.js (MOCK_MODE = true)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded">
                <span className="text-2xl">🌐</span>
                <div>
                  <p className="font-medium">Switch to Real API</p>
                  <p className="text-muted-foreground">Set MOCK_MODE = false in request.js</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
