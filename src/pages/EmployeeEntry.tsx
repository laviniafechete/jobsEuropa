import { useNavigate } from "react-router-dom";

export default function EmployeeEntry() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Zona Angajați
            </h1>
            <p className="text-gray-600">
              Descoperă joburi sau creează-ți contul
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/jobs")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <span className="text-lg">Caută</span>
              <span className="ml-2">Joburi</span>
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/employee/login")}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Autentificare
              </button>
              
              <button
                onClick={() => navigate("/employee/register")}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Înregistrare
              </button>
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
}
