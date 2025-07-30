import Footer from "../components/Footer";
import { Star } from "lucide-react";
import { useState } from "react";

const MOCK_REVIEWS = [
  {
    name: "Andrei P.",
    rating: 5,
    text: "Platformă foarte ușor de folosit, am găsit rapid de muncă în construcții!",
  },
  {
    name: "Maria B.",
    rating: 4,
    text: "Am reușit să angajez personal de menaj în Belgia fără bătăi de cap.",
  },
  {
    name: "Jan D.",
    rating: 5,
    text: "Interfață clară, suport rapid pe WhatsApp, recomand!",
  },
];

export default function PlatformReviews() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [form, setForm] = useState({ name: "", rating: 5, text: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviews([{ ...form }, ...reviews]);
    setForm({ name: "", rating: 5, text: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center px-4">
        <section className="w-full max-w-2xl mt-10 mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 mt-10">
            Recenzii platformă
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Ce spun utilizatorii despre Jobs Europa:
          </p>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col gap-3"
          >
            <input
              className="border rounded px-3 py-2"
              placeholder="Nume (opțional)"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Rating:</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={
                    n <= form.rating ? "text-yellow-400" : "text-gray-300"
                  }
                  onClick={() => setForm((f) => ({ ...f, rating: n }))}
                  aria-label={`Rating ${n}`}
                >
                  <Star
                    className="w-6 h-6"
                    fill={n <= form.rating ? "#facc15" : "none"}
                  />
                </button>
              ))}
            </div>
            <textarea
              className="border rounded px-3 py-2"
              placeholder="Scrie o recenzie..."
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Trimite recenzia
            </button>
          </form>
          <div className="flex flex-col gap-4">
            {reviews.map((r, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-4 text-left"
              >
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
        </section>
      </main>
      {/* Footer eliminat */}
    </div>
  );
}
