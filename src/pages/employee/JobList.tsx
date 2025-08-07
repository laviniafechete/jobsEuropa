import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Loader2, LogIn, UserPlus } from "lucide-react";
import CustomSelect from "../../components/CustomSelect";
import JobCard from "../../components/JobCard";
import { useAuthStore } from "../../stores/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";
import { API_BASE_URL } from "../../config/env";

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  category: string;
  salary: {
    min?: number;
    max?: number;
    currency: string;
  };
  employer: {
    companyName: string;
    emailOrPhone?: string;
    companyProfile?: {
      logo?: string;
      name?: string;
      industry?: string;
      description?: string;
      website?: string;
      phone?: string;
      email?: string;
      address?: string;
      benefits?: string[];
    };
  };
  hasApplied?: boolean;
  benefits?: string[];
  skills?: string[];
  views: number;
  createdAt: string;
}

const DOMAINS = [
  { value: "", label: "Toate" },
  { value: "Construcții", label: "Construcții" },
  { value: "Menaj", label: "Menaj" },
  { value: "Curățenie", label: "Curățenie" },
  { value: "Îngrijire bătrâni", label: "Îngrijire bătrâni" },
  { value: "Transport", label: "Transport" },
  { value: "Agricultură", label: "Agricultură" },
  { value: "Fabricație", label: "Fabricație" },
  { value: "Altele", label: "Altele" },
];

const TYPES = [
  { value: "", label: "Toate" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

export default function JobList() {
  const { user, token } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");
  const [type, setType] = useState("");
  const [applying, setApplying] = useState<{ [key: string]: boolean }>({});
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Fetch jobs from API
  const fetchJobs = async (pageNum = 1, reset = false) => {
    console.log(`fetchJobs called: page=${pageNum}, reset=${reset}`);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "10",
        ...(search && { search }),
        ...(domain && { category: domain }),
        ...(type && { type }),
      });

      const response = await fetch(
        `${API_BASE_URL}/jobs?${params}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      
      if (reset) {
        setJobs(data.data.jobs);
      } else {
        setJobs(prev => [...prev, ...data.data.jobs]);
      }
      
      setHasMore(data.data.pagination.hasNext);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      showError("Eroare la încărcarea joburilor");
    } finally {
      setLoading(false);
    }
  };

  // Load jobs on component mount and when filters change
  useEffect(() => {
    console.log(`useEffect triggered: search="${search}", domain="${domain}", type="${type}"`);
    fetchJobs(1, true);
  }, [search, domain, type]);

  // Apply to job
  const handleApply = async (job: Job) => {
    if (!user) {
      showError("Trebuie să fii autentificat pentru a aplica.");
      return;
    }
    
    if (!token) {
      showError("Sesiunea a expirat. Te rugăm să te loghezi din nou.");
      return;
    }

    if (job.hasApplied) {
      showError("Ai aplicat deja la acest job.");
      return;
    }
    
    if (!acceptTerms) {
      showError('Trebuie să accepți Politica de Confidențialitate și Termenii și Condițiile!');
      return;
    }

    setApplying(prev => ({ ...prev, [job._id]: true }));

    try {
      const response = await fetch(
        `${API_BASE_URL}/jobs/${job._id}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Eroare la aplicare");
      }

      // Update local state
      setJobs(prev => 
        prev.map(j => 
          j._id === job._id 
            ? { ...j, hasApplied: true }
            : j
        )
      );

      showSuccess("Aplicația a fost trimisă cu succes!");
    } catch (error: any) {
      console.error("Error applying to job:", error);
      showError(error.message || "Nu s-a putut trimite aplicarea. Vă rugăm încercați din nou.");
    } finally {
      setApplying(prev => ({ ...prev, [job._id]: false }));
    }
  };

  // Load more jobs
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchJobs(page + 1, false);
    }
  };

  // Sort jobs: non-applied first, then applied
  const sortedJobs = [...jobs].sort((a, b) => {
    if (a.hasApplied && !b.hasApplied) return 1;
    if (!a.hasApplied && b.hasApplied) return -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Format salary
  const formatSalary = (salary: any) => {
    if (!salary) return "Salariu negociabil";
    if (typeof salary === "string") return salary;
    if (typeof salary === "object") {
      const min = salary.min ?? "";
      const max = salary.max ?? "";
      const currency = salary.currency || "RON";
      if (min && max) return `${min} - ${max} ${currency}/lună`;
      if (min) return `${min}+ ${currency}/lună`;
      if (max) return `Până la ${max} ${currency}/lună`;
      return "Salariu negociabil";
    }
    return "Salariu negociabil";
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" />
          <span>Se încarcă joburile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {!token ? (
            /* Guest user header */
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Descoperă joburi în Europa
              </h1>
              <p className="text-gray-600 mb-4">
                Navighează prin mii de oferte de muncă. Contactează direct angajatorii prin telefon, WhatsApp sau email.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/employee/login')}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Autentificare
                </button>
                <button
                  onClick={() => navigate('/employee/register')}
                  className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Înregistrare
                </button>
              </div>
            </div>
          ) : (
            /* Authenticated user header */
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Caută joburi
              </h1>
              <p className="text-gray-600">
                Găsește jobul perfect pentru tine în Europa
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">
              Caută joburi
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" />
              <input
                className="w-full border rounded-lg pl-10 pr-4 py-2"
                placeholder="Titlu, companie, locație..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-auto">
            <CustomSelect
              label="Domeniu"
              value={domain}
              options={DOMAINS}
              onChange={setDomain}
              className="mb-0"
              name="domain"
            />
          </div>
          <div className="w-full md:w-auto">
            <CustomSelect
              label="Tip"
              value={type}
              options={TYPES}
              onChange={setType}
              className="mb-0"
              name="type"
            />
          </div>
        </div>

        {user && user.hasCompletedCv === false && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded flex items-center justify-between">
            <div>
              <b>CV-ul nu este completat!</b> Completează CV-ul pentru pentru mai multa vizibilitate din partea angajatorilor.
            </div>
            <button
              onClick={() => window.location.href = '/employee/cv'}
              className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded"
            >
              Completează CV-ul
            </button>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {sortedJobs.length === 0 && !loading && (
            <div className="col-span-2 text-center text-gray-500 py-12">
              <Filter className="mx-auto mb-2" />
              Niciun job găsit pentru criteriile selectate.
            </div>
          )}
          
          {sortedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onClick={(job) => { setSelectedJob(job); setShowModal(true); }}
            />
          ))}
        </div>
        {/* Modal detalii job */}
        {showModal && selectedJob && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            onClick={() => setShowModal(false)}
          >
            <div 
              className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
              <div className="flex items-center gap-4 mb-4">
                {selectedJob.employer?.companyProfile?.logo && (
                  <img
                    src={selectedJob.employer.companyProfile.logo}
                    alt="Logo companie"
                    className="w-16 h-16 object-cover rounded-full border"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedJob.title}</h2>
                  <p className="text-blue-600 font-medium mb-1">{selectedJob.employer?.companyName || "Companie necunoscută"}</p>
                  {selectedJob.employer?.companyProfile?.industry && (
                    <div className="text-xs text-gray-500">{selectedJob.employer.companyProfile.industry}</div>
                  )}
                </div>
              </div>
              <div className="mb-2 text-gray-700">
                <b>Locație:</b> {selectedJob.location}
              </div>
              <div className="mb-2 text-gray-700">
                <b>Tip:</b> {selectedJob.type}
              </div>
              <div className="mb-2 text-gray-700">
                <b>Categorie:</b> {selectedJob.category}
              </div>
              <div className="mb-2 text-gray-700">
                <b>Salariu:</b> {formatSalary(selectedJob.salary)}
              </div>
              <div className="mb-2 text-gray-700">
                <b>Descriere:</b> {selectedJob.description}
              </div>
              {selectedJob.employer?.companyProfile?.description && (
                <div className="mb-2 text-gray-700">
                  <b>Despre companie:</b> {selectedJob.employer.companyProfile.description}
                </div>
              )}
              {selectedJob.employer?.companyProfile?.website && (
                <div className="mb-2 text-gray-700">
                  <b>Website:</b> <a href={selectedJob.employer.companyProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{selectedJob.employer.companyProfile.website}</a>
                </div>
              )}
              {selectedJob.employer?.companyProfile?.address && (
                <div className="mb-2 text-gray-700">
                  <b>Adresă:</b> {selectedJob.employer.companyProfile.address}
                </div>
              )}
              {selectedJob.employer?.companyProfile?.benefits && selectedJob.employer.companyProfile.benefits.length > 0 && (
                <div className="mb-2 text-gray-700">
                  <b>Beneficii:</b>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedJob.employer.companyProfile.benefits.map((b: string, i: number) => (
                      <span key={i} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{b}</span>
                    ))}
                  </div>
                </div>
              )}
              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div className="mb-2 text-gray-700">
                  <b>Competențe:</b>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedJob.skills.map((s: string, i: number) => (
                      <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mb-2 text-gray-700">
                <b>Vizualizări:</b> {selectedJob.views}
              </div>
            </div>
          </div>
        )}
        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Se încarcă...
                </div>
              ) : (
                "Încarcă mai multe joburi"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
