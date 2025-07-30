import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useSnackbar } from '../../hooks/useSnackbar';
import PhoneInput from '../../components/PhoneInput';

const EmployeeResetPassword: React.FC = () => {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState({ prefix: '+40', number: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedValue, setSubmittedValue] = useState('');
  
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      let response;
      if (method === 'email') {
        response = await authAPI.resetPassword({ email, userType: 'user' });
      } else {
        response = await authAPI.resetPassword({ phone: phone.prefix + phone.number, userType: 'user' });
      }
      if (response.success) {
        showSuccess('Instrucțiunile de resetare au fost trimise cu succes!');
        setIsSubmitted(true);
        setSubmittedValue(method === 'email' ? email : phone.number);
      } else {
        showError(response.error?.message || 'Eroare la trimitere');
      }
    } catch (error: any) {
      showError(error.response?.data?.error?.message || 'A apărut o eroare la trimitere');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
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
              {method === 'email' ? 'Email trimis!' : 'SMS trimis!'}
            </h1>
            <p className="text-gray-700 mb-6">
              Am trimis instrucțiuni de resetare la <strong>{submittedValue}</strong>
            </p>
            <button
              onClick={() => navigate('/employee/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              Înapoi la login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Resetare parolă
            </h1>
            <p className="text-gray-600">
              Alege metoda preferată pentru a primi instrucțiuni de resetare
            </p>
          </div>
          <div className="flex justify-center gap-4 mb-6">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-semibold border transition ${method === 'email' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
              onClick={() => setMethod('email')}
            >
              Email
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-semibold border transition ${method === 'phone' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
              onClick={() => setMethod('phone')}
            >
              Telefon
            </button>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              onClick={() => navigate("/employee/login")}
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

export default EmployeeResetPassword;
