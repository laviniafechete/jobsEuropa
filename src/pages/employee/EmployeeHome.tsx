import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Briefcase, MapPin, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "../../config/env";

interface AppliedJob {
  _id: string;
  title: string;
  location: string;
  employer?: {
    companyName: string;
  };
  status: string;
  appliedAt: string;
  job?: {
    _id: string;
    title: string;
    location: string;
    employer?: {
      companyName: string;
    };
  };
}

export default function EmployeeHome() {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [showCVModal, setShowCVModal] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchedTokenRef = useRef<string | null>(null);

  // Fetch applied jobs
  const fetchAppliedJobs = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data.appliedJobs) {
          setAppliedJobs(data.data.appliedJobs); // Show all applied jobs
        }
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !token) return;
    if (fetchedTokenRef.current === token) return;
    fetchedTokenRef.current = token;
    // Dacă CV-ul nu e completat, arată pop-up-ul
    if (user && !user.hasCompletedCv) {
      setShowCVModal(true);
    }
    // Eliminăm redirectul automat către joburi
    // else if (user && user.hasCompletedCv && !location.state?.fromProfile) {
    //   hasNavigated.current = true;
    //   navigate("/employee/jobs");
    // }

    // Fetch applied jobs
    fetchAppliedJobs();
  }, [user, token]);

  const handleCompleteCV = () => {
    setShowCVModal(false);
    navigate("/employee/cv");
  };

  const handleSkipCV = () => {
    setShowCVModal(false);
    navigate("/employee/jobs");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'reviewed':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Acceptată';
      case 'rejected':
        return 'Respinsă';
      case 'reviewed':
        return 'În revizuire';
      default:
        return 'În așteptare';
    }
  };

  // Pop-up pentru CV
  if (showCVModal) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-blue-100 p-3">
                  <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Completează CV-ul tău
            </h1>
            <p className="text-gray-700 mb-6">
              Pentru a aplica la joburi și a avea șanse mai mari să fii angajat, completează profilul tău profesional.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleCompleteCV}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Completează CV-ul
              </button>
              <button
                onClick={handleSkipCV}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Mai târziu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Bun venit, {user?.name}!
          </h1>
          <p className="text-gray-600 mb-6">
            Aceasta este pagina ta principală ca candidat.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button
              onClick={() => navigate("/employee/profile")}
              className="p-6 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition text-center"
            >
              <div className="mb-3">
                <svg className="w-12 h-12 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-blue-900 text-lg mb-2">Profilul meu</h3>
              <p className="text-sm text-blue-700">Vezi și editează profilul tău personal și profesional</p>
            </button>
            
            <button
              onClick={() => navigate("/employee/jobs")}
              className="p-6 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition text-center"
            >
              <div className="mb-3">
                <svg className="w-12 h-12 text-purple-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h3 className="font-semibold text-purple-900 text-lg mb-2">Caută joburi</h3>
              <p className="text-sm text-purple-700">Găsește oportunități de muncă și aplică la ele</p>
            </button>
          </div>
        </div>

        {/* Applied Jobs Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Joburile la care am aplicat
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Se încarcă aplicațiile...</p>
            </div>
          ) : appliedJobs.length > 0 ? (
            <div className="space-y-4">
              {appliedJobs.map((applied) => (
                <div key={applied._id || applied.job?._id}>
                  <div
                    key={applied._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {applied.job?.title || applied.title}
                        </h3>
                        <p className="text-blue-600 text-sm mb-2">
                          {applied.job?.employer?.companyName || applied.employer?.companyName || "Angajator necunoscut"}
                        </p>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPin className="mr-1" size={14} />
                          {applied.job?.location || applied.location}
                        </div>
                        <p className="text-gray-500 text-xs">
                          Aplicat pe {formatDate(applied.appliedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(applied.status)}`}>
                          {getStatusText(applied.status)}
                        </span>
                        {applied.status === 'accepted' && (
                          <CheckCircle className="text-green-500" size={16} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nu ai aplicat încă la niciun job
              </h3>
              <p className="text-gray-500 mb-4">
                Începe să cauți joburi și să aplici la cele care te interesează.
              </p>
              <button
                onClick={() => navigate("/employee/jobs")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Caută joburi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
