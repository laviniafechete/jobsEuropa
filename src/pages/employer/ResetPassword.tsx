import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useSnackbar } from '../../hooks/useSnackbar';
import PhoneInput from '../../components/PhoneInput';

const EmployerResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState({ prefix: '+40', number: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedValue, setSubmittedValue] = useState('');
  
  // For password change with token
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();

  // Check if token is valid when component mounts
  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/auth/verify-reset-token/employer/${token}`);
      const data = await response.json();
      
      if (data.success) {
        setIsTokenValid(true);
      } else {
        setIsTokenValid(false);
        showError('Token invalid sau expirat');
      }
    } catch (error) {
      setIsTokenValid(false);
      showError('Eroare la verificarea token-ului');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      showError('Parolele nu se potrivesc');
      return;
    }
    
    if (newPassword.length < 6) {
      showError('Parola trebuie să aibă minim 6 caractere');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/auth/change-password-with-token/employer/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        showSuccess('Parola a fost schimbată cu succes!');
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        sessionStorage.clear();
        setTimeout(() => {
          navigate('/employer/login');
        }, 2000);
      } else {
        showError(data.error?.message || 'Eroare la schimbarea parolei');
      }
    } catch (error: any) {
      showError('A apărut o eroare la schimbarea parolei');
    } finally {
      setIsChangingPassword(false);
    }
  };

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
        setSubmittedValue(method === 'email' ? email : phone.number);
      } else {
        showError(response.error?.message || 'Eroare la trimiterea email-ului');
      }
    } catch (error: any) {
      showError(error.response?.data?.error?.message || 'A apărut o eroare la trimiterea email-ului');
    } finally {
      setIsLoading(false);
    }
  };

  // Show password change form if token is valid
  if (token && isTokenValid === true) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Schimbă parola
              </h1>
              <p className="text-gray-600">
                Introdu parola nouă pentru contul tău
              </p>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Parolă nouă
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Parola nouă"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmă parola
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Confirmă parola"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Se schimbă...
                  </div>
                ) : (
                  'Schimbă parola'
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
  }

  // Show error if token is invalid
  if (token && isTokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-red-100 p-3">
                  <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Link invalid
            </h1>
            <p className="text-gray-700 mb-6">
              Link-ul de resetare este invalid sau a expirat. Te rugăm să soliciti un nou link.
            </p>
            <button
              onClick={() => navigate('/employer/reset-password')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              Solicită resetare nouă
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while checking token
  if (token && isTokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-600 mt-4">Se verifică link-ul...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show success message after submitting reset request
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
              {method === 'email' ? 'Email trimis!' : 'SMS trimis!'}
            </h1>
            <p className="text-gray-700 mb-6">
              Am trimis instrucțiuni de resetare la <strong>{submittedValue}</strong>
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

  // Show the reset request form (original form)
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
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
              className={`px-4 py-2 rounded-lg font-semibold border transition ${method === 'email' ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
              onClick={() => setMethod('email')}
            >
              Email
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-semibold border transition ${method === 'phone' ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
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
