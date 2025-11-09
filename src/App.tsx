import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import PasswordGate from './components/PasswordGate';

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Snackbar from "./components/Snackbar";
import CookieConsent from './components/CookieConsent';

// Pages
import Landing from "./pages/Landing";
import About from "./pages/About";
import PlatformReviews from "./pages/PlatformReviews";
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import CookiesPolicy from './pages/CookiesPolicy';

import NewsletterPolicy from './pages/NewsletterPolicy';
import DataDeletion from './pages/DataDeletion';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminEmployers from './pages/admin/AdminEmployers';
import AdminJobs from './pages/admin/AdminJobs';
import AdminReports from './pages/admin/AdminReports';

// Employee pages
import EmployeeEntry from "./pages/EmployeeEntry";
import EmployeeHome from "./pages/employee/EmployeeHome";
import EmployeeLogin from "./pages/employee/Login";
import EmployeeRegister from "./pages/employee/Register";
import EmployeeVerifyEmail from "./pages/employee/VerifyEmail";
import EmployeeCVForm from "./pages/employee/CVForm";
import EmployeeJobList from "./pages/employee/JobList";
import EmployeeReviews from "./pages/employee/EmployeeReviews";
import EmployeeResetPassword from "./pages/employee/ResetPassword";
import EmployeeProfile from "./pages/employee/Profile";
import OAuthSuccess from './pages/employee/OAuthSuccess';

// Employer pages
import EmployerEntry from "./pages/EmployerEntry";
import EmployerHome from "./pages/employer/EmployerHome";
import EmployerLogin from "./pages/employer/Login";
import EmployerRegister from "./pages/employer/Register";
import EmployerVerifyEmail from "./pages/employer/VerifyEmail";
import EmployerPostJobForm from "./pages/employer/PostJobForm";
import EmployerEmployeeList from "./pages/employer/EmployeeList";
import EmployerReviews from "./pages/employer/EmployerReviews";
import EmployerResetPassword from "./pages/employer/ResetPassword";
import EmployerProfile from "./pages/employer/Profile";
import SubscriptionSuccess from './pages/employer/SubscriptionSuccess';
import SubscriptionCancel from './pages/employer/SubscriptionCancel';

// Hooks
import { useAuthStore } from "./stores/authStore";
import { EmployerProvider } from "./context/EmployerContext";
import { clearAllCookies } from "./utils/cookieUtils";

// Component to clear localStorage on specific routes
const RouteWatcher = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Clear localStorage when navigating to root or admin login
    if (currentPath === '/' || currentPath === '/admin' || currentPath === '/admin/login') {
      console.log(`Clearing localStorage and cookies for route: ${currentPath}`);
      
      // Clear all cookies only when on root route
      if (currentPath === '/') {
        clearAllCookies();
      }
      
      // COMPLETELY clear localStorage - remove everything
      localStorage.clear();
      
      // Also clear sessionStorage
      sessionStorage.clear();
      
      console.log('LocalStorage and SessionStorage completely cleared' + (currentPath === '/' ? ' and cookies cleared' : ''));
    }
  }, [location.pathname]);

  return null;
};

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ 
  children, 
  userType 
}: { 
  children: React.ReactNode; 
  userType: 'user' | 'employer' | null;
}) => {
  const { token, userType: authUserType } = useAuthStore();
  
  console.log("ProtectedRoute - token:", token ? "exists" : "missing", "authUserType:", authUserType, "required userType:", userType);
  
  if (!token) {
    console.log("No token, redirecting to /");
    return <Navigate to="/" replace />;
  }
  
  if (userType && authUserType !== userType) {
    console.log("Wrong user type, redirecting to /");
    return <Navigate to="/" replace />;
  }
  
  console.log("ProtectedRoute - allowing access");
  return <>{children}</>;
};

function App() {
  return (
    <PasswordGate>
      <QueryClientProvider client={queryClient}>
        <Router>
          <RouteWatcher />
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 mt-16">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/about" element={<About />} />
                <Route path="/reviews" element={<PlatformReviews />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/cookies-policy" element={<CookiesPolicy />} />
        
                <Route path="/newsletter-policy" element={<NewsletterPolicy />} />
                <Route path="/data-deletion" element={<DataDeletion />} />
                
                {/* Public jobs route for browsing */}
                <Route path="/jobs" element={<EmployeeJobList />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/employers" element={<AdminEmployers />} />
                <Route path="/admin/jobs" element={<AdminJobs />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                
                {/* Employee routes */}
                <Route path="/employee" element={<EmployeeEntry />} />
                <Route path="/employee/login" element={<EmployeeLogin />} />
                <Route path="/employee/register" element={<EmployeeRegister />} />
                <Route path="/employee/verify-email" element={<EmployeeVerifyEmail />} />
                <Route path="/employee/reset-password" element={<EmployeeResetPassword />} />
                <Route path="/user/reset-password" element={<EmployeeResetPassword />} />
                <Route path="/employee/oauth-success" element={<OAuthSuccess />} />
                
                <Route 
                  path="/employee/home" 
                  element={
                    <ProtectedRoute userType="user">
                      <EmployeeHome />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/employee/profile" 
                  element={
                    <ProtectedRoute userType="user">
                      <EmployeeProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/employee/cv" 
                  element={
                    <ProtectedRoute userType="user">
                      <EmployeeCVForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/employee/jobs" 
                  element={
                    <ProtectedRoute userType="user">
                      <EmployeeJobList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/employee/reviews" 
                  element={
                    <ProtectedRoute userType="user">
                      <EmployeeReviews />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Employer routes */}
                <Route path="/employer" element={<EmployerEntry />} />
                <Route path="/employer/login" element={<EmployerLogin />} />
                <Route path="/employer/register" element={<EmployerRegister />} />
                <Route path="/employer/verify-email" element={<EmployerVerifyEmail />} />
                <Route path="/employer/reset-password" element={<EmployerResetPassword />} />
                <Route
                  path="/employer/home"
                  element={
                    <EmployerProvider>
                      <ProtectedRoute userType="employer">
                        <EmployerHome />
                      </ProtectedRoute>
                    </EmployerProvider>
                  }
                />
                <Route
                  path="/employer/post-job"
                  element={
                    <EmployerProvider>
                      <ProtectedRoute userType="employer">
                        <EmployerPostJobForm />
                      </ProtectedRoute>
                    </EmployerProvider>
                  }
                />
                <Route
                  path="/employer/employees"
                  element={
                    <EmployerProvider>
                      <ProtectedRoute userType="employer">
                        <EmployerEmployeeList />
                      </ProtectedRoute>
                    </EmployerProvider>
                  }
                />
                <Route
                  path="/employer/reviews"
                  element={
                    <EmployerProvider>
                      <ProtectedRoute userType="employer">
                        <EmployerReviews />
                      </ProtectedRoute>
                    </EmployerProvider>
                  }
                />
                <Route
                  path="/employer/profile"
                  element={
                    <EmployerProvider>
                      <ProtectedRoute userType="employer">
                        <EmployerProfile />
                      </ProtectedRoute>
                    </EmployerProvider>
                  }
                />
                <Route path="/employer/subscription-success" element={<SubscriptionSuccess />} />
                <Route path="/employer/subscription-cancel" element={<SubscriptionCancel />} />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <Snackbar />
            <CookieConsent />
          </div>
        </Router>
      </QueryClientProvider>
    </PasswordGate>
  );
}

export default App;
