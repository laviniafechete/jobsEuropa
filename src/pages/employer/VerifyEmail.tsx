import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import { useSnackbar } from "../../hooks/useSnackbar";

const EmployerVerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Se verifică email-ul tău...");
  const hasVerifiedRef = useRef(false);

  const verifyEmail = useCallback(async () => {
    const token = searchParams.get("token");

    if (!token) {
      const missingTokenMessage = "Token invalid sau lipsă";
      setStatus("error");
      setMessage(missingTokenMessage);
      showError(missingTokenMessage);
      return;
    }

    if (hasVerifiedRef.current) return;
    hasVerifiedRef.current = true;

    try {
      const response = await authAPI.verifyEmail("employer", token);

      if (response.success) {
        const successMessage = "Email verificat cu succes! Poți să te autentifici acum.";
        setStatus("success");
        setMessage(successMessage);
        showSuccess(successMessage);
      } else {
        const errorMessage = response.error?.message || "Token invalid sau expirat";
        setStatus("error");
        setMessage(errorMessage);
        showError(errorMessage);
      }
    } catch (error) {
      setStatus("error");
      const errorMessage =
        error instanceof Error
          ? error.message
          : "A apărut o eroare la verificarea email-ului";
      setMessage(errorMessage);
      showError(errorMessage);
    }
  }, [searchParams, showError, showSuccess]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Verificare Email
            </h1>
            
            <div className="mb-6">
              {status === 'verifying' && (
                <div className="flex justify-center">
                  <svg className="animate-spin h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
              
              {status === 'success' && (
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
              
              {status === 'error' && (
                <div className="flex justify-center">
                  <div className="rounded-full bg-red-100 p-3">
                    <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">
              {message}
            </p>
            
            {status === 'success' && (
              <button
                onClick={() => navigate('/employer/login')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Mergi la Login
              </button>
            )}
            
            {status === 'error' && (
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/employer/login')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200"
                >
                  Mergi la Login
                </button>
                <button
                  onClick={() => navigate('/employer/register')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition duration-200"
                >
                  Încearcă din nou
                </button>
              </div>
            )}
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

export default EmployerVerifyEmail; 