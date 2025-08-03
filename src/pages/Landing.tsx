import { useNavigate } from "react-router-dom";
import EntryCard from "../components/EntryCard";
import { ArrowRight } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Găsește sau oferă <span className="text-blue-600">muncă</span> rapid și sigur
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
        Locul unde oportunitățile de muncă se întâlnesc cu oamenii potriviți. 
          <span className="text-blue-600 font-semibold"> Construcții</span>,
          <span className="text-green-600 font-semibold"> menaj</span>,
          <span className="text-orange-600 font-semibold"> curățenie</span>,
          <span className="text-pink-600 font-semibold"> îngrijire bătrâni </span>
          și multe altele.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full px-4">
          <EntryCard type="candidat" onClick={() => navigate('/employee')} />
          <EntryCard type="angajator" onClick={() => navigate('/employer')} />
        </div>
        <div className="mt-12 flex flex-col items-center gap-2">
          <a
            href="https://wa.me/40757758647"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
          >
            Suport WhatsApp Business
            <ArrowRight className="w-4 h-4" />
          </a>
          <span className="text-xs text-gray-500">
            Contact rapid pentru întrebări și suport uman
          </span>
        </div>
      </main>
      {/* Footer eliminat */}
    </div>
  );
}
