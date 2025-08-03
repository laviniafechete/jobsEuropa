import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { authAPI } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

export default function SubscriptionCancel() {
  const navigate = useNavigate();
  const updateEmployer = useAuthStore((s) => s.updateEmployer);

  useEffect(() => {
    // Refresh status abonament după anulare (opțional)
    authAPI.getUserInfo().then((res) => {
      if (res.success && res.data && (res.data as any).subscriptionActive !== undefined) {
        updateEmployer(res.data as any);
      }
    });
  }, [updateEmployer]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Plata a fost anulată</h1>
        <p className="mb-6">Nu s-a activat niciun abonament. Poți încerca din nou oricând.</p>
        <button
          onClick={() => navigate('/employer/home')}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded"
        >
          Mergi la dashboard
        </button>
      </div>
    </div>
  );
} 