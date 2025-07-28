import {
  Award,
  BookOpen,
  Calendar,
  FileText,
  Settings,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AdminDashboard = () => {
  // Mock data - replace with actual API calls
  const [stats] = useState({
    totalUsers: 124,
    totalPublications: 89,
    totalProjects: 15,
    totalAreas: 8,
    activeResearchers: 45,
    pendingReviews: 12,
  });

  const publicationTypeData = [
    { name: "Journal Articles", value: 45, color: "#3B82F6" },
    { name: "Conference Papers", value: 28, color: "#10B981" },
    { name: "Book Chapters", value: 12, color: "#F59E0B" },
    { name: "Other", value: 4, color: "#EF4444" },
  ];

  const monthlyActivity = [
    { month: "Jan", publications: 8, users: 12, projects: 2 },
    { month: "Feb", publications: 12, users: 8, projects: 1 },
    { month: "Mar", publications: 15, users: 15, projects: 3 },
    { month: "Apr", publications: 10, users: 20, projects: 2 },
    { month: "May", publications: 18, users: 25, projects: 4 },
    { month: "Jun", publications: 22, users: 18, projects: 3 },
  ];

  const recentActivity = [
    {
      type: "publication",
      user: "Dr. Sarah Johnson",
      action: "uploaded a new journal article",
      time: "2 hours ago",
    },
    {
      type: "user",
      user: "Prof. Michael Chen",
      action: "registered as a researcher",
      time: "5 hours ago",
    },
    {
      type: "project",
      user: "Dr. Emily Rodriguez",
      action: 'created project "Climate Change Impact"',
      time: "1 day ago",
    },
    {
      type: "publication",
      user: "Dr. James Wilson",
      action: "updated conference paper",
      time: "2 days ago",
    },
    {
      type: "user",
      user: "Dr. Lisa Thompson",
      action: "updated profile information",
      time: "3 days ago",
    },
  ];

  const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      yellow: "bg-yellow-50 text-yellow-600",
      purple: "bg-purple-50 text-purple-600",
      red: "bg-red-50 text-red-600",
      indigo: "bg-indigo-50 text-indigo-600",
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {trend && (
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {trend}% from last month
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  const ActivityItem = ({ activity }) => {
    const getIcon = (type) => {
      switch (type) {
        case "publication":
          return <FileText className="w-4 h-4 text-blue-600" />;
        case "user":
          return <Users className="w-4 h-4 text-green-600" />;
        case "project":
          return <Target className="w-4 h-4 text-purple-600" />;
        default:
          return <Calendar className="w-4 h-4 text-gray-600" />;
      }
    };

    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="flex-shrink-0 mt-1">{getIcon(activity.type)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">
            <span className="font-medium">{activity.user}</span>{" "}
            {activity.action}
          </p>
          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Overview of your research platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            trend={12}
            color="blue"
          />
          <StatCard
            title="Publications"
            value={stats.totalPublications}
            icon={FileText}
            trend={8}
            color="green"
          />
          <StatCard
            title="Active Projects"
            value={stats.totalProjects}
            icon={Target}
            trend={25}
            color="purple"
          />
          <StatCard
            title="Research Areas"
            value={stats.totalAreas}
            icon={BookOpen}
            color="yellow"
          />
          <StatCard
            title="Researchers"
            value={stats.activeResearchers}
            icon={Award}
            trend={15}
            color="indigo"
          />
          <StatCard
            title="Pending Reviews"
            value={stats.pendingReviews}
            icon={Settings}
            color="red"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Publication Types */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Publication Types
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={publicationTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {publicationTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Activity */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Activity
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="publications"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="projects"
                    stroke="#F59E0B"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all activity →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Add New User
              </span>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Create Publication
              </span>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center">
              <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">
                New Project
              </span>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors text-center">
              <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Add Research Area
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
