import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";
import { X, User, Upload } from "lucide-react";
import { API_BASE_URL } from "../../config/env";

type EditCVModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function EditCVModal({ open, onClose }: EditCVModalProps) {
  const { user, token, updateUser } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  const [form, setForm] = useState({
    name: "",
    experience: "",
    skills: "",
    location: "",
    availability: "",
    photoUrl: "",
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populează formularul cu datele din localStorage când modalul se deschide
  useEffect(() => {
    if (open) {
      const savedCv = localStorage.getItem("cv");
      if (savedCv) {
        try {
          const parsed = JSON.parse(savedCv);
          setForm(parsed);
          setPhotoPreview(parsed.photoUrl || null);
        } catch {
          setForm({
            name: "",
            experience: "",
            skills: "",
            location: "",
            availability: "",
            photoUrl: "",
          });
          setPhotoPreview(null);
        }
      } else {
        setForm({
          name: "",
          experience: "",
          skills: "",
          location: "",
          availability: "",
          photoUrl: "",
        });
        setPhotoPreview(null);
      }
      setIsSubmitting(false); // Resetăm starea la deschiderea modalului
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setForm((f) => ({ ...f, photoUrl: url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    if (!token) {
      showError("Sesiunea a expirat. Te rugăm să te loghezi din nou.");
      onClose();
      return;
    }
    
    setIsSubmitting(true);

    try {
      if (!user) throw new Error("Utilizator neautentificat");

      const response = await fetch(`${API_BASE_URL}/cv/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, userId: user.userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error?.message?.includes("token")) {
          showError("Sesiunea a expirat. Te rugăm să te loghezi din nou.");
          onClose();
          return;
        }
        throw new Error("Eroare la salvarea CV-ului");
      }

      // Actualizează localStorage cu noul CV
      localStorage.setItem("cv", JSON.stringify(form));
      localStorage.setItem("hasCompletedCv", "true");

      // Update user in store
      updateUser({
        hasCompletedCv: true,
        // Add other CV fields to user data
      });
      
      showSuccess("CV-ul a fost actualizat cu succes!");
      onClose();
      // Nu e nevoie de setIsSubmitting(false) aici, modalul se închide
    } catch (error) {
      showError("A apărut o problemă la salvarea CV-ului. Încearcă din nou.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          onClick={onClose}
          aria-label="Închide"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <User className="text-blue-600" /> Editează profilul
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            className="border rounded-lg px-4 py-2"
            placeholder="Nume complet"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="experience"
            className="border rounded-lg px-4 py-2"
            placeholder="Experiență (ex: 2 ani construcții)"
            value={form.experience}
            onChange={handleChange}
            required
          />
          <input
            name="skills"
            className="border rounded-lg px-4 py-2"
            placeholder="Aptitudini (ex: zidar, zugrav, menaj)"
            value={form.skills}
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
          <input
            name="availability"
            className="border rounded-lg px-4 py-2"
            placeholder="Disponibilitate (ex: full-time, ocazional)"
            value={form.availability}
            onChange={handleChange}
            required
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <Upload className="text-blue-600" />
            <span>Schimbă poza de profil (opțional)</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhoto}
            />
          </label>
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover mx-auto border"
            />
          )}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Se salvează..." : "Salvează modificările"}
          </button>
        </form>
      </div>
    </div>
  );
}
