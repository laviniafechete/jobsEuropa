import { useState } from "react";
import { Star } from "lucide-react";

// Recenzii mock pentru candidat
const mockReviews = [
  {
    id: 1,
    employer: "Construct SRL",
    rating: 5,
    comment: "Candidat foarte dedicat și punctual. Recomandat!",
    date: "2024-01-15"
  },
  {
    id: 2, 
    employer: "Clean Pro",
    rating: 4,
    comment: "Muncă de calitate, s-ar putea îmbunătăți viteza.",
    date: "2024-01-10"
  }
];

export default function EmployeeReviews() {
  const [reviews] = useState(mockReviews);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Recenzii primite de la angajatori</h1>
        <div className="bg-white rounded-xl shadow p-6 mt-8 max-w-xl mx-auto">
          <h3 className="text-xl font-bold mb-4">
            Recenzii primite de la angajatori
          </h3>
          <div className="flex flex-col gap-4">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-blue-50 rounded-xl p-4 text-left">
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      fill="#facc15"
                    />
                  ))}
                  <span className="text-gray-700 font-semibold">
                    {review.employer || "Anonim"}
                  </span>
                </div>
                <div className="text-gray-600">{review.comment}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
