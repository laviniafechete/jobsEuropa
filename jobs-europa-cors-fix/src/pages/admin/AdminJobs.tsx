import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  ArrowLeft,
  MapPin,
  Calendar,
  Search,
  Filter,
  Eye,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Building2
} from 'lucide-react';
import { useAdminStore } from '../../stores/adminStore';
import { useSnackbar } from '../../hooks/useSnackbar';

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  type: string;
  experience: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  employer: {
    _id: string;
    companyProfile?: {
      name?: string;
    };
    companyName?: string;
  };
  applications: Array<{
    user: string;
    appliedAt: string;
  }>;
  views: number;
  status: string;
  createdAt: string;
}

interface JobsData {
  jobs: Job[];
  totalJobs: number;
  activeJobs: number;
  categories: Array<{ _id: string; count: number }>;
}

const getJobStatusBadge = (job: Job) => {
  const applicationsCount = job.applications?.length || 0;
  
  if (job.status === 'active') {
    return {
      label: 'Activ',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle
    };
  } else {
    return {
      label: 'Inactiv',
      color: 'bg-red-100 text-red-800',
      icon: XCircle
    };
  }
};

const formatSalary = (salary?: { min: number; max: number; currency: string }) => {
  if (!salary || (!salary.min && !salary.max)) return 'Nesalarizat';
  
  if (salary.min && salary.max) {
    return `${salary.min} - ${salary.max} ${salary.currency || 'RON'}`;
  } else if (salary.min) {
    return `De la ${salary.min} ${salary.currency || 'RON'}`;
  } else if (salary.max) {
    return `Până la ${salary.max} ${salary.currency || 'RON'}`;
  }
  
  return 'Negociabil';
};

export default function AdminJobs() {
  const [jobsData, setJobsData] = useState<JobsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const { token } = useAdminStore();
  const { showError } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchJobs();
  }, [token]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // /api/jobs returns { success: true, data: { jobs: [...] } }
      const jobs = data.success && data.data ? data.data.jobs : (Array.isArray(data) ? data : []);
      
      if (jobs && jobs.length >= 0) {
        const activeJobs = jobs.filter((job: Job) => job.status === 'active').length;
        
        // Group by categories
        const categoryCount: { [key: string]: number } = {};
        jobs.forEach((job: Job) => {
          if (job.category) {
            categoryCount[job.category] = (categoryCount[job.category] || 0) + 1;
          }
        });
        
        const categories = Object.entries(categoryCount).map(([category, count]) => ({
          _id: category,
          count
        })).sort((a, b) => b.count - a.count);

        setJobsData({
          jobs,
          totalJobs: jobs.length,
          activeJobs,
          categories
        });
      } else {
        console.warn('No jobs data received');
        setJobsData({
          jobs: [],
          totalJobs: 0,
          activeJobs: 0,
          categories: []
        });
      }
    } catch (error) {
      console.error('Jobs fetch error:', error);
      showError('Eroare de conexiune la încărcarea joburilor');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobsData?.jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employer?.companyProfile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employer?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || job.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Se încarcă joburile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Briefcase className="w-6 h-6 mr-2 text-purple-500" />
                  Gestionare Joburi
                </h1>
                <p className="text-gray-600">Vizualizează și gestionează toate joburile postate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Caută joburi, locații, companii..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Toate categoriile</option>
                  {jobsData?.categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category._id} ({category.count})
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Toate statusurile</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-full p-3 mr-4">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Joburi</p>
                <p className="text-2xl font-bold text-gray-900">{jobsData?.totalJobs || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-full p-3 mr-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Joburi Active</p>
                <p className="text-2xl font-bold text-gray-900">{jobsData?.activeJobs || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-full p-3 mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Aplicații</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobsData?.jobs.reduce((total, job) => total + (job.applications?.length || 0), 0) || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 rounded-full p-3 mr-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vizualizări</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobsData?.jobs.reduce((total, job) => total + (job.views || 0), 0) || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Lista Joburi ({filteredJobs.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Companie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categorie & Locație
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salariu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aplicații
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Postat
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map((job) => {
                  const statusBadge = getJobStatusBadge(job);
                  return (
                    <tr key={job._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="bg-purple-100 rounded-full p-2 mr-3">
                            <Briefcase className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 max-w-xs">
                              {job.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {job.type} • {job.experience}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {job.employer?.companyProfile?.name || job.employer?.companyName || 'Companie necunoscută'}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900 capitalize">
                            {job.category}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            {job.location}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatSalary(job.salary)}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Users className="w-3 h-3 mr-1" />
                            {job.applications?.length || 0}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <Eye className="w-3 h-3 mr-1" />
                            {job.views || 0}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                          <statusBadge.icon className="w-3 h-3 mr-1" />
                          {statusBadge.label}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(job.createdAt).toLocaleString('ro-RO')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nu există joburi</h3>
              <p className="mt-1 text-sm text-gray-500">
                Nu s-au găsit joburi care să corespundă criteriilor de căutare.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 