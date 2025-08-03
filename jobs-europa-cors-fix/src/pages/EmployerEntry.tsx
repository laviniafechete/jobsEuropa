import { useNavigate } from "react-router-dom";

export default function EmployerEntry() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Zona Angajatori
            </h1>
            <p className="text-gray-600">
              Alege ce vrei să faci
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/employer/login")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              Autentificare
            </button>
            
            <button
              onClick={() => navigate("/employer/register")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              Înregistrare
            </button>
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
}
