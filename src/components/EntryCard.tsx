import { User, Building2 } from "lucide-react";

interface EntryCardProps {
  type: "candidat" | "angajator";
  onClick: () => void;
}

const cardContent = {
  candidat: {
    title: "Acces Candidat",
    description:
      "Caută joburi în construcții, menaj, curățenie, îngrijire bătrâni și alte munci fizice. Creează-ți CV-ul, aplică rapid și primește recenzii de la angajatori.",
    icon: <User className="w-10 h-10 text-blue-600" />,
    button: "Descoperă noi joburi",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },
  angajator: {
    title: "Acces Angajator",
    description:
      "Publică anunțuri, caută candidați potriviți și gestionează recenziile. O platformă creată special pentru angajatori care vor să găsească oameni de încredere.",
    icon: <Building2 className="w-10 h-10 text-green-600" />,
    button: "Autentificare cu email",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
  },
};

export default function EntryCard({ type, onClick }: EntryCardProps) {
  const content = cardContent[type];
  const isCandidat = type === "candidat";
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col sm:flex-row max-w-2xl mx-auto w-full">
      <img
        src={content.image}
        alt={content.title}
        className="w-full sm:w-56 h-40 sm:h-48 object-cover"
        loading="lazy"
      />
      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {content.icon}
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              {content.title}
            </h2>
          </div>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            {content.description}
          </p>
        </div>
        <button
          onClick={onClick}
          className={`mt-2 w-full py-2 rounded-lg font-semibold text-white transition p-2
            ${
              type === "candidat"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            }
          `}
        >
          {content.button}
        </button>
      </div>
    </div>
  );
}
