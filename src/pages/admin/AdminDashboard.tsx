import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  Euro, 
  Activity,
  LogOut,
  Check
} from 'lucide-react';
import { useAdminStore } from '../../stores/adminStore';
import { useSnackbar } from '../../hooks/useSnackbar';

interface Analytics {
  overview: {
    totalUsers: number;
    totalEmployers: number;
    totalJobs: number;
    totalCvs: number;
    totalApplications: number;
    estimatedMonthlyRevenue: number;
  };
  thisMonth: {
    users: number;
    employers: number;
    jobs: number;
    cvs: number;
  };
  growth: {
    userGrowthRate: number;
    employerGrowthRate: number;
  };
  users: {
    total: number;
    verifiedEmail: number;
    verifiedPhone: number;
    verificationRate: number;
  };
  employers: {
    total: number;
    withProfile: number;
    activeSubscriptions: number;
    trialEmployers: number;
    profileCompletionRate: number;
  };
  jobs: {
    total: number;
    active: number;
    byCategory: Array<{ _id: string; count: number }>;
  };
  recentActivity: {
    users: number;
    employers: number;
    jobs: number;
  };
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  change?: number;
}

const StatCard = ({ title, value, icon: Icon, color, change }: StatCardProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        {change && (
          <p className={`text-sm mt-2 flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            {change > 0 ? '+' : ''}{change}% luna aceasta
          </p>
        )}
      </div>
      <div className={`${color} rounded-full p-3`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { admin, token, logout } = useAdminStore();
  const { showError } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchAnalytics();
  }, [token, navigate]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        showError(data.message || 'Eroare la încărcarea datelor');
      }
    } catch (error) {
      console.error('Analytics error:', error);
      showError('Eroare de conexiune');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Se încarcă dashboard-ul...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Nu s-au putut încărca datele</p>
          <button 
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600">Salut, {admin?.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Deconectare
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Utilizatori"
            value={analytics.overview.totalUsers.toLocaleString()}
            icon={Users}
            color="bg-blue-500"
            change={analytics.growth.userGrowthRate}
          />
          <StatCard
            title="Total Angajatori"
            value={analytics.overview.totalEmployers.toLocaleString()}
            icon={Building2}
            color="bg-green-500"
            change={analytics.growth.employerGrowthRate}
          />
          <StatCard
            title="Total Joburi"
            value={analytics.overview.totalJobs.toLocaleString()}
            icon={Briefcase}
            color="bg-purple-500"
          />
          <StatCard
            title="Venituri Estimate"
            value={`€${analytics.overview.estimatedMonthlyRevenue.toFixed(2)}`}
            icon={Euro}
            color="bg-yellow-500"
          />
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Users Analytics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Statistici Utilizatori
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email verificat</span>
                <div className="flex items-center">
                  <span className="text-green-600 font-medium mr-2">
                    {analytics.users.verifiedEmail}
                  </span>
                  <Check className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Telefon verificat</span>
                <div className="flex items-center">
                  <span className="text-green-600 font-medium mr-2">
                    {analytics.users.verifiedPhone}
                  </span>
                  <Check className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rata verificare</span>
                <span className="text-blue-600 font-medium">
                  {analytics.users.verificationRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Înregistrări luna aceasta</span>
                <span className="text-purple-600 font-medium">
                  {analytics.thisMonth.users}
                </span>
              </div>
            </div>
          </div>

          {/* Employers Analytics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-green-500" />
              Statistici Angajatori
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cu profil completat</span>
                <span className="text-green-600 font-medium">
                  {analytics.employers.withProfile}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Abonamente active</span>
                <span className="text-blue-600 font-medium">
                  {analytics.employers.activeSubscriptions}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">În perioada trial</span>
                <span className="text-yellow-600 font-medium">
                  {analytics.employers.trialEmployers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rata completare profil</span>
                <span className="text-purple-600 font-medium">
                  {analytics.employers.profileCompletionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Jobs by Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-purple-500" />
              Joburi pe Categorii
            </h3>
            <div className="space-y-3">
              {analytics.jobs.byCategory.slice(0, 6).map((category, index) => (
                <div key={category._id || index} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize">
                    {category._id || 'Necategorisit'}
                  </span>
                  <span className="text-gray-900 font-medium">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total joburi active</span>
                <span className="text-green-600 font-medium">
                  {analytics.jobs.active} / {analytics.jobs.total}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-red-500" />
              Activitate Recentă (7 zile)
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Utilizatori noi</span>
                <span className="text-blue-600 font-medium">
                  {analytics.recentActivity.users}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Angajatori noi</span>
                <span className="text-green-600 font-medium">
                  {analytics.recentActivity.employers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Joburi postate</span>
                <span className="text-purple-600 font-medium">
                  {analytics.recentActivity.jobs}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total aplicații</span>
                <span className="text-orange-600 font-medium">
                  {analytics.overview.totalApplications}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button 
            onClick={() => navigate('/admin/users')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Vizualizare Utilizatori
          </button>
          <button 
            onClick={() => navigate('/admin/employers')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Vizualizare Angajatori
          </button>
          <button 
            onClick={() => navigate('/admin/jobs')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Gestionare Joburi
          </button>
          <button 
            onClick={() => navigate('/admin/reports')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Rapoarte Detaliate
          </button>
        </div>
      </div>
    </div>
  );
} 