import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { authAPI } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const updateEmployer = useAuthStore((s) => s.updateEmployer);

  useEffect(() => {
    // Refresh status abonament după plată
    authAPI.getUserInfo().then((res) => {
      if (res.success && res.data && (res.data as any).subscriptionActive !== undefined) {
        updateEmployer(res.data as any); // Cast explicit Employer
      }
    });
  }, [updateEmployer]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Abonament activat cu succes!</h1>
        <p className="mb-6">Ai acces la toate funcțiile premium. Mulțumim pentru abonare!</p>
        <button
          onClick={() => navigate('/employer/home')}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
        >
          Mergi la dashboard
        </button>
      </div>
    </div>
  );
} 