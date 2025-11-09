import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft,
  Mail,
  Phone,
  Check,
  X,
  Search,
  Filter,
  Crown,
  Clock
} from 'lucide-react';
import { useAdminStore } from '../../stores/adminStore';
import { useSnackbar } from '../../hooks/useSnackbar';

interface Employer {
  _id: string;
  companyProfile?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    domain?: string;
  };
  email?: string;
  hasProfileCompleted: boolean;
  subscriptionType: string;
  subscriptionActive: boolean;
  trialEnd?: string;
  createdAt: string;
}

interface EmployersData {
  employers: Employer[];
  subscriptionTrends: Array<{
    _id: string;
    count: number;
  }>;
}

export default function AdminEmployers() {
  const [employersData, setEmployersData] = useState<EmployersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubscription, setFilterSubscription] = useState('all');
  const { token } = useAdminStore();
  const { showError } = useSnackbar();
  const navigate = useNavigate();

  const fetchEmployers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/employers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setEmployersData(data.data);
      } else {
        showError(data.message || 'Eroare la încărcarea angajatorilor');
      }
    } catch (error) {
      console.error('Employers fetch error:', error);
      showError('Eroare de conexiune');
    } finally {
      setLoading(false);
    }
  }, [showError, token]);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchEmployers();
  }, [token, navigate, fetchEmployers]);

  const filteredEmployers = employersData?.employers.filter(employer => {
    const companyName = employer.companyProfile?.name || '';
    const email = employer.companyProfile?.email || employer.email || '';
    
    const matchesSearch = searchTerm === '' || 
      companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.companyProfile?.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterSubscription === 'all' ||
      (filterSubscription === 'trial' && employer.subscriptionType === 'trial') ||
      (filterSubscription === 'basic' && employer.subscriptionType === 'basic') ||
      (filterSubscription === 'premium' && employer.subscriptionType === 'premium') ||
      (filterSubscription === 'active' && employer.subscriptionActive) ||
      (filterSubscription === 'inactive' && !employer.subscriptionActive);

    return matchesSearch && matchesFilter;
  }) || [];

  const getSubscriptionStatus = (employer: Employer) => {
    if (employer.subscriptionType === 'trial') {
      const trialEnd = employer.trialEnd ? new Date(employer.trialEnd) : null;
      const isExpired = trialEnd ? trialEnd < new Date() : false;
      return {
        label: isExpired ? 'Trial Expirat' : 'Trial Activ',
        color: isExpired ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800',
        icon: Clock
      };
    } else if (employer.subscriptionActive) {
      return {
        label: `${employer.subscriptionType?.charAt(0).toUpperCase()}${employer.subscriptionType?.slice(1)} Activ`,
        color: employer.subscriptionType === 'premium' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800',
        icon: Crown
      };
    } else {
      return {
        label: 'Fără Abonament',
        color: 'bg-gray-100 text-gray-800',
        icon: X
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Se încarcă angajatorii...</p>
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
                  <Building2 className="w-6 h-6 mr-2 text-green-500" />
                  Gestionare Angajatori
                </h1>
                <p className="text-gray-600">Vizualizează și gestionează toți angajatorii</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Caută angajatori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterSubscription}
                onChange={(e) => setFilterSubscription(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Toți angajatorii</option>
                <option value="trial">Trial</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="active">Abonament Activ</option>
                <option value="inactive">Fără Abonament</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-full p-3 mr-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{employersData?.employers.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-full p-3 mr-4">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Profil Completat</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employersData?.employers.filter(e => e.hasProfileCompleted).length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-full p-3 mr-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Abonamente Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employersData?.employers.filter(e => e.subscriptionActive).length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-500 rounded-full p-3 mr-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">În Trial</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employersData?.employers.filter(e => e.subscriptionType === 'trial').length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Employers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Lista Angajatori ({filteredEmployers.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Companie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Locație
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Profil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Abonament
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Înregistrat
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployers.map((employer) => {
                  const subscriptionStatus = getSubscriptionStatus(employer);
                  return (
                    <tr key={employer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-green-100 rounded-full p-2 mr-3">
                            <Building2 className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {employer.companyProfile?.name || 'Nume companie nedefinit'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employer.companyProfile?.domain || 'Domeniu nedefinit'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {(employer.companyProfile?.email || employer.email) && (
                            <div className="flex items-center text-sm text-gray-900">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {employer.companyProfile?.email || employer.email}
                            </div>
                          )}
                          {employer.companyProfile?.phone && (
                            <div className="flex items-center text-sm text-gray-900">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              {employer.companyProfile?.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employer.companyProfile?.location || 'Locație nedefinită'}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        {employer.hasProfileCompleted ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            Completat
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <X className="w-3 h-3 mr-1" />
                            Incomplet
                          </span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subscriptionStatus.color}`}>
                          <subscriptionStatus.icon className="w-3 h-3 mr-1" />
                          {subscriptionStatus.label}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(employer.createdAt).toLocaleString('ro-RO')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 