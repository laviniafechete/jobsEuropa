import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import logo from "../assets/logo.png";
import { Menu, X, LogOut, User, AlertTriangle, Briefcase, Building2 } from "lucide-react";
import { API_BASE_URL } from "../config/env";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, employer, userType, logout, token } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Debug logging
  console.log("Header render - userType:", userType, "user:", user, "employer:", employer, "token:", token ? "exists" : "missing");
  console.log("Header employer companyProfile:", employer?.companyProfile);
  console.log("Header employer logoUrl:", employer?.companyProfile?.logoUrl);

  const handleLogoClick = () => {
    console.log("Logo clicked - userType:", userType);
    if (userType === 'employer') {
      console.log("Navigating to /employer/home");
      navigate('/employer/home');
    } else if (userType === 'user') {
      console.log("Navigating to /employee/home");
      navigate('/employee/home');
    } else {
      console.log("Navigating to /");
      navigate('/');
    }
  };

  const handleNavigate = (target: string) => {
    setMobileOpen(false);
    
    console.log("handleNavigate called with target:", target);
    console.log("Current userType:", userType);
    
    // Dacă sunt logat ca candidat și vreau să merg la angajator, arată modal
    if (userType === 'user' && target === 'employer') {
      setPendingNavigation('employer');
      setShowConfirmModal(true);
      return;
    }
    
    // Dacă sunt logat ca angajator și vreau să merg la candidat, arată modal
    if (userType === 'employer' && target === 'employee') {
      setPendingNavigation('employee');
      setShowConfirmModal(true);
      return;
    }
    
    switch (target) {
      case 'employee':
        if (userType === 'employer') {
          logout();
          navigate('/employee');
        } else if (userType === 'user') {
          navigate('/employee/home');
        } else {
          navigate('/employee');
        }
        break;
      case 'employer':
        if (userType === 'user') {
          logout();
          navigate('/employer');
        } else if (userType === 'employer') {
          navigate('/employer/home');
        } else {
          navigate('/employer');
        }
        break;
      case 'profile':
        console.log("Profile case - userType:", userType);
        if (userType === 'user') {
          console.log("Navigating to /employee/home");
          navigate('/employee/home');
        } else if (userType === 'employer') {
          console.log("Navigating to /employer/home");
          navigate('/employer/home');
        }
        break;
      case 'about':
        navigate('/about');
        break;
      case 'reviews':
        navigate('/reviews');
        break;
      default:
        navigate('/');
    }
  };

  const handleConfirmNavigation = () => {
    if (pendingNavigation) {
      logout();
      if (pendingNavigation === 'employer') {
        navigate('/employer');
      } else if (pendingNavigation === 'employee') {
        navigate('/employee');
      }
    }
    setShowConfirmModal(false);
    setPendingNavigation(null);
  };

  const handleCancelNavigation = () => {
    setShowConfirmModal(false);
    setPendingNavigation(null);
  };

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate('/');
  };

  const isLoggedIn = !!userType;

  return (
    <>
      <div className="w-full bg-white shadow-sm fixed top-0 left-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between py-2 px-2 sm:py-3 sm:px-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            <span className="block">
              <img
                src={logo}
                alt="Jobs Europa Logo"
                className="h-8 w-auto sm:h-10"
                style={{ maxWidth: 140 }}
              />
            </span>
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex gap-4 lg:gap-6 items-center">
            {/* Butoane Angajat/Angajator stil pill */}
            <div className="flex gap-2 items-center mr-4">
              {userType !== 'user' && (
                <button
                  className="flex items-center gap-1 px-4 py-1 rounded-full border border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-500 hover:text-white font-semibold transition"
                  onClick={() => handleNavigate('employee')}
                >
                  <User className="w-4 h-4" /> Candidat
                </button>
              )}
              {userType !== 'employer' && (
                <button
                  className="flex items-center gap-1 px-4 py-1 rounded-full border border-green-500 text-green-700 bg-green-50 hover:bg-green-500 hover:text-white font-semibold transition"
                  onClick={() => handleNavigate('employer')}
                >
                  <Briefcase className="w-4 h-4" /> Angajator
                </button>
              )}
            </div>
            {/* Butoane suplimentare DOAR pe /employer/company */}
            {location.pathname === "/employer/company" && (
              <div className="flex gap-2 items-center">
                <button
                  className="flex items-center gap-1 px-4 py-1 rounded-full border border-green-500 text-green-700 bg-green-50 hover:bg-green-500 hover:text-white font-semibold transition"
                  onClick={() => navigate("/employer/post-job")}
                >
                  <Briefcase className="w-4 h-4" /> Postează job
                </button>
                <button
                  className="flex items-center gap-1 px-4 py-1 rounded-full border border-purple-500 text-purple-700 bg-purple-50 hover:bg-purple-500 hover:text-white font-semibold transition"
                  onClick={() => navigate("/employer/employees")}
                >
                  <User className="w-4 h-4" /> Candidați
                </button>
              </div>
            )}
            {location.pathname === "/employer/post-job" && (
              <div className="flex gap-2 items-center">
                <button
                  className="flex items-center gap-1 px-4 py-1 rounded-full border border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-500 hover:text-white font-semibold transition"
                  onClick={() => navigate("/employer/company")}
                >
                  <Briefcase className="w-4 h-4" /> Profil companie
                </button>
                <button
                  className="flex items-center gap-1 px-4 py-1 rounded-full border border-purple-500 text-purple-700 bg-purple-50 hover:bg-purple-500 hover:text-white font-semibold transition"
                  onClick={() => navigate("/employer/employees")}
                >
                  <User className="w-4 h-4" /> Candidați
                </button>
              </div>
            )}
            {location.pathname === "/employer/employees" && (
              <div className="flex gap-2 items-center">
                <button
                  className="flex items-center gap-1 px-4 py-1 rounded-full border border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-500 hover:text-white font-semibold transition"
                  onClick={() => navigate("/employer/company")}
                >
                  <Briefcase className="w-4 h-4" /> Profil companie
                </button>
                <button
                  className="flex items-center gap-1 px-4 py-1 rounded-full border border-green-500 text-green-700 bg-green-50 hover:bg-green-500 hover:text-white font-semibold transition"
                  onClick={() => navigate("/employer/post-job")}
                >
                  <Briefcase className="w-4 h-4" /> Postează job
                </button>
              </div>
            )}
            {/* Restul link-urilor și profilul */}
            {isLoggedIn && (
              <div className="flex items-center gap-2 ml-4">
                <button
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium transition text-base"
                  onClick={() => {
                    if (userType === 'employer') {
                      navigate('/employer/profile');
                    } else {
                      handleNavigate("profile");
                    }
                  }}
                >
                  {userType === 'employer' && employer?.companyProfile?.logoUrl ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={employer.companyProfile.logoUrl.startsWith('http') ? employer.companyProfile.logoUrl : `${API_BASE_URL.replace('/api', '')}${employer.companyProfile.logoUrl}`}
                        alt="Logo companie"
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => {
                          console.error('Header company logo load error:', e);
                        }}
                      />
                      <span>{employer?.companyName || "Profil"}</span>
                    </div>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      {user?.name || employer?.companyName || "Profil"}
                    </>
                  )}
                </button>
                <button
                  className="flex items-center gap-1 text-gray-500 hover:text-red-500 font-medium transition text-base"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" /> Deconectare
                </button>
              </div>
            )}
          </div>
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Deschide meniul"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        </div>
        {/* Mobile menu overlay */}
        <div
          className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 ${
            mobileOpen ? "block md:hidden" : "hidden"
          }`}
          onClick={() => setMobileOpen(false)}
          aria-hidden={!mobileOpen}
        />
        {/* Mobile menu */}
        <nav
          className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-lg z-50
            transform transition-transform duration-200
            ${mobileOpen ? "translate-x-0" : "translate-x-full"}
            md:hidden
          `}
          aria-label="Meniu mobil"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <img
              src={logo}
              alt="Jobs Europa Logo"
              className="h-8 w-auto"
              style={{ maxWidth: 100 }}
              onClick={handleLogoClick}
            />
            <button
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Închide meniul"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-7 h-7" />
            </button>
          </div>
          {/* h-full + flex-col + justify-between + min-h-0 pentru ca butonul de logout sa fie jos */}
          <div className="flex flex-col h-full min-h-0 px-4 py-6 pb-20">
            <div className="flex flex-col gap-1 flex-1">
              {/* Arată "Angajat" doar dacă nu sunt logat ca angajat */}
              {userType !== 'user' && (
                <button
                  className="text-gray-700 hover:text-blue-600 font-medium text-lg py-2 text-left"
                  onClick={() => handleNavigate("employee")}
                >
                  Candidat
                </button>
              )}
              {/* Arată "Angajator" doar dacă nu sunt logat ca angajator */}
              {userType !== 'employer' && (
                <button
                  className="text-gray-700 hover:text-blue-600 font-medium text-lg py-2 text-left"
                  onClick={() => handleNavigate("employer")}
                >
                  Angajator
                </button>
              )}
              {isLoggedIn && (
                <button
                  className="text-gray-700 hover:text-blue-600 font-medium text-lg py-2 text-left flex items-center gap-2"
                  onClick={() => handleNavigate("profile")}
                >
                  <User className="w-4 h-4" />
                  {user?.name || employer?.companyName || "Profil"}
                </button>
              )}
            </div>
            {location.pathname === "/employer/post-job" && (
              <div className="flex flex-col gap-2 mb-4">
                <button
                  className="flex items-center gap-1 px-4 py-1 rounded-full border border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-500 hover:text-white font-semibold transition w-full"
                  onClick={() => { setMobileOpen(false); navigate("/employer/company"); }}
                >
                  <Briefcase className="w-4 h-4" /> Profil companie
                </button>
                <button
                  className="flex items-center gap-1 px-4 py-1 rounded-full border border-purple-500 text-purple-700 bg-purple-50 hover:bg-purple-500 hover:text-white font-semibold transition w-full"
                  onClick={() => { setMobileOpen(false); navigate("/employer/employees"); }}
                >
                  <User className="w-4 h-4" /> Candidați
                </button>
              </div>
            )}
            {location.pathname === "/employer/employees" && (
              <div className="flex flex-col gap-2 mb-4">
                <button
                  className="flex items-center gap-1 px-4 py-1 rounded-full border border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-500 hover:text-white font-semibold transition w-full"
                  onClick={() => { setMobileOpen(false); navigate("/employer/company"); }}
                >
                  <Briefcase className="w-4 h-4" /> Profil companie
                </button>
                <button
                  className="flex items-center gap-1 px-4 py-1 rounded-full border border-green-500 text-green-700 bg-green-50 hover:bg-green-500 hover:text-white font-semibold transition w-full"
                  onClick={() => { setMobileOpen(false); navigate("/employer/post-job"); }}
                >
                  <Briefcase className="w-4 h-4" /> Postează job
                </button>
              </div>
            )}
            {isLoggedIn && (
              <button
                className="mt-auto mb-2 flex items-center gap-2 text-gray-500 hover:text-red-500 font-medium text-lg py-2 text-left border-t pt-4"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" /> Deconectare
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={handleCancelNavigation} />
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmă schimbarea
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              {pendingNavigation === 'employer' 
                ? "Vrei să te deconectezi ca candidat și să te loghezi ca angajator?"
                : "Vrei să te deconectezi ca angajator și să te loghezi ca candidat?"
              }
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelNavigation}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Anulează
              </button>
              <button
                onClick={handleConfirmNavigation}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Confirmă
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
