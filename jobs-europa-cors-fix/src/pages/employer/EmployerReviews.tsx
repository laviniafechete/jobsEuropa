import { Star } from "lucide-react";
import { useState } from "react";

// Recenzii mock pentru angajator
const MOCK_EMPLOYER_REVIEWS = [
  { name: "Ion Popescu", rating: 5, text: "Companie serioasă, plata la timp!" },
  { name: "Maria Ionescu", rating: 4, text: "Totul a decurs ok, recomand." },
];

export default function EmployerReviews() {
  const [reviews] = useState(MOCK_EMPLOYER_REVIEWS);

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8 max-w-xl mx-auto">
      <h3 className="text-xl font-bold mb-4">
        Recenzii primite de la angajați
      </h3>
      <div className="flex flex-col gap-4">
        {reviews.map((r, idx) => (
          <div key={idx} className="bg-green-50 rounded-xl p-4 text-left">
            <div className="flex items-center gap-2 mb-1">
              {[...Array(r.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400"
                  fill="#facc15"
                />
              ))}
              <span className="text-gray-700 font-semibold">
                {r.name || "Anonim"}
              </span>
            </div>
            <div className="text-gray-600">{r.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
