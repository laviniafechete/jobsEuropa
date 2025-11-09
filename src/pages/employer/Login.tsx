import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authAPI } from '../../services/api';
import { useSnackbar } from '../../hooks/useSnackbar';

const EmployerLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();

  // Prevent redirect to home if on reset-password page
  useEffect(() => {
    if (
      window.location.pathname === '/employer/reset-password' ||
      window.location.pathname.startsWith('/employer/reset-password')
    ) {
      // Do not redirect
      return;
    }
    // Existing logic (if any) for redirecting authenticated users
    // Example:
    // if (token) navigate('/employer/home');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double submission
    
    setIsLoading(true);

    try {
      const response = await authAPI.loginEmployer(formData);
      
      if (response.success && response.data && response.data.employer) {
        login(response.data.token, 'employer', response.data.employer);
        showSuccess('Autentificare reușită!');
        navigate('/employer/home');
      } else {
        showError(response.error?.message || 'Autentificare eșuată');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'A apărut o eroare la autentificare';
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Autentificare Angajator
            </h1>
            <p className="text-gray-600">
              Conectează-te la contul tău pentru a gestiona joburile
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="exemplu@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Parolă
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Se autentifică...
                </div>
              ) : (
                'Autentificare'
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <Link
              to="/employer/reset-password"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Ai uitat parola?
            </Link>
            
            <div className="text-gray-600 text-sm">
              Nu ai cont?{" "}
              <Link
                to="/employer/register"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Înregistrează-te
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/")}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition"
            >
              ← Înapoi la pagina principală
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerLogin;
