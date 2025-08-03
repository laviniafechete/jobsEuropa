import { User, Building2 } from "lucide-react";
import candidatImage from "../assets/angajat.jpg";
import angajatorImage from "../assets/angajator.jpg";

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
    image: candidatImage,
  },
  angajator: {
    title: "Acces Angajator",
    description:
      "Publică anunțuri, caută candidați potriviți și gestionează recenziile. O platformă creată special pentru angajatori care vor să găsească oameni de încredere.",
    icon: <Building2 className="w-10 h-10 text-green-600" />,
    button: "Autentificare cu email",
    image: angajatorImage,
  },
};

export default function EntryCard({ type, onClick }: EntryCardProps) {
  const content = cardContent[type];
  const isCandidat = type === "candidat";
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full min-h-[400px] sm:min-h-[450px] max-w-sm mx-auto w-full">
      <div className="relative h-48 sm:h-52">
        <img
          src={content.image}
          alt={content.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {content.icon}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {content.title}
            </h2>
          </div>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {content.description}
          </p>
        </div>
        <button
          onClick={onClick}
          className={`mt-4 w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors duration-200 hover:shadow-lg
            ${
              type === "candidat"
                ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                : "bg-green-600 hover:bg-green-700 active:bg-green-800"
            }
          `}
        >
          {content.button}
        </button>
      </div>
    </div>
  );
}
