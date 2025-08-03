import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useSnackbar } from '../../hooks/useSnackbar';
import PhoneInput from '../../components/PhoneInput';

const EmployerRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirm: '',
    phone: { prefix: '+40', number: '' },
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();

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
      const payload = {
        ...formData,
        phone: formData.phone.prefix + formData.phone.number,
      };
      const response = await authAPI.registerEmployer(payload);
      
      if (response.success) {
        showSuccess('Cont de angajator creat cu succes! Verifică email-ul pentru a activa contul.');
        navigate('/employer/login');
      } else {
        showError(response.error?.message || 'Înregistrare eșuată');
      }
    } catch (error: any) {
      showError(error.response?.data?.error?.message || 'A apărut o eroare la înregistrare');
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
              Înregistrare Angajator
            </h1>
            <p className="text-gray-600">
              Creează-ți contul pentru a posta joburi
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Nume companie
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                autoComplete="organization"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Numele companiei tale"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>

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
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmă parola
              </label>
              <input
                type="password"
                id="confirm"
                name="confirm"
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
                value={formData.confirm}
                onChange={handleChange}
              />
            </div>

            <PhoneInput
              label="Telefon (WhatsApp)"
              value={formData.phone}
              onChange={val => setFormData({ ...formData, phone: val })}
              required
            />

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
                  Se înregistrează...
                </div>
              ) : (
                'Înregistrare'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-gray-600 text-sm">
              Ai deja cont?{" "}
              <Link
                to="/employer/login"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Autentifică-te
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

export default EmployerRegister;
