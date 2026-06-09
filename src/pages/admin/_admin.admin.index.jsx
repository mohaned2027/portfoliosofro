import React from 'react';
import { useProfessor, useCourses, useResearches, useAchievements, useStats } from '../../context/DataContext';
import DashboardLayout from '../../components/admin/DashboardLayout';

export default function DashboardHome() {
  const professor = useProfessor();
  const courses = useCourses();
  const researches = useResearches();
  const achievements = useAchievements();
  const stats = useStats();

  const StatCard = ({ title, value, icon }) => (
    <div className="bg-card border rounded-lg p-6 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Welcome back, {professor?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-2">{professor?.title}</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Courses" 
            value={courses?.length || 0}
            icon="📚"
          />
          <StatCard 
            title="Researches" 
            value={researches?.length || 0}
            icon="🔬"
          />
          <StatCard 
            title="Achievements" 
            value={achievements?.length || 0}
            icon="🏆"
          />
          <StatCard 
            title="Publications" 
            value={stats?.publications || 0}
            icon="📄"
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
              <p><strong>Students Supervised:</strong> {stats?.supervised || 0}</p>
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
    </DashboardLayout>
  );
}
