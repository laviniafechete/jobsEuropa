import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useSnackbar } from '../../hooks/useSnackbar';
import PhoneInput from '../../components/PhoneInput';

const EmployerResetPassword: React.FC = () => {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState({ prefix: '+40', number: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double submission
    
    setIsLoading(true);

    try {
      let response;
      if (method === 'email') {
        response = await authAPI.resetPassword({ email, userType: 'employer' });
      } else {
        response = await authAPI.resetPassword({ phone: phone.prefix + phone.number, userType: 'employer' });
      }
      
      if (response.success) {
        showSuccess('Email-ul de resetare a fost trimis cu succes!');
        setIsSubmitted(true);
      } else {
        showError(response.error?.message || 'Eroare la trimiterea email-ului');
      }
    } catch (error: any) {
      showError(error.response?.data?.error?.message || 'A apărut o eroare la trimiterea email-ului');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Email trimis!
            </h1>
            <p className="text-gray-700 mb-6">
              Am trimis instrucțiuni de resetare a parolei la adresa <strong>{email}</strong>
            </p>
            
            <button
              onClick={() => navigate('/employer/login')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              Înapoi la login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Resetare parolă
            </h1>
            <p className="text-gray-600">
              Introdu email-ul tău pentru a primi instrucțiuni de resetare
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {method === 'email' ? (
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            ) : (
              <PhoneInput
                label="Număr de telefon"
                value={phone}
                onChange={setPhone}
                required
              />
            )}
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
                  Se trimite...
                </div>
              ) : (
                method === 'email' ? 'Trimite email' : 'Trimite SMS'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/employer/login")}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition"
            >
              ← Înapoi la login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerResetPassword;
