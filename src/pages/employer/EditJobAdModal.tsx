import React, { useState, useEffect } from "react";
import { useEmployer } from "../../context/EmployerContext";
import { X, Briefcase, Upload } from "lucide-react";
import type { JobAd } from "../../context/EmployerContext";

type Props = {
  ad?: JobAd;
  open: boolean;
  onClose: () => void;
};

export default function EditJobAdModal({ ad, open, onClose }: Props) {
  const { updateJobAd } = useEmployer();
  const [form, setForm] = useState({
    title: "",
    requirements: "",
    location: "",
    type: "",
    salary: "",
    domain: "",
    image: "",
  });
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ad) {
      setForm({
        title: ad.title,
        requirements: ad.requirements,
        location: ad.location,
        type: ad.type,
        salary: typeof ad.salary === 'string' ? ad.salary : `${ad.salary.min || ''} RON`,
        domain: ad.domain,
        image: ad.image || "",
      });
      setImgPreview(ad.image || null);
    }
  }, [ad]);

  if (!open || !ad) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await updateJobAd({ ...form, id: ad.id });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Eroare la actualizarea job-ului');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in px-2 sm:px-4">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          onClick={onClose}
          aria-label="Închide"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Briefcase className="text-green-600" /> Editează anunțul
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="title"
            className="border rounded-lg px-4 py-2"
            placeholder="Titlu job"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="requirements"
            className="border rounded-lg px-4 py-2"
            placeholder="Cerințe/Descriere"
            value={form.requirements}
            onChange={handleChange}
            required
          />
          <input
            name="location"
            className="border rounded-lg px-4 py-2"
            placeholder="Localitate/Județ/Țară"
            value={form.location}
            onChange={handleChange}
            required
          />
          <select
            name="type"
            className="border rounded-lg px-3 py-2 w-full text-base focus:ring-2 focus:ring-green-500"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="">Tip job</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Ocazional">Ocazional</option>
            <option value="Proiect">Proiect</option>
            <option value="Sezonier">Sezonier</option>
          </select>
          <input
            name="salary"
            className="border rounded-lg px-4 py-2"
            placeholder="Salariu (ex: 4500 RON/lună)"
            value={form.salary}
            onChange={handleChange}
            required
          />
          <input
            name="domain"
            className="border rounded-lg px-4 py-2"
            placeholder="Domeniu (ex: construcții)"
            value={form.domain}
            onChange={handleChange}
            required
          />
          {imgPreview && (
            <img
              src={imgPreview}
              alt="Preview"
              className="w-24 h-24 rounded object-cover mx-auto border"
            />
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {isSubmitting ? "Se salvează..." : "Salvează modificările"}
          </button>
        </form>
      </div>
    </div>
  );
}
