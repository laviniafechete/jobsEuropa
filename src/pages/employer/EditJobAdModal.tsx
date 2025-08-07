import React, { useState, useEffect } from "react";
import { useEmployer } from "../../context/EmployerContext";
import { useAuthStore } from "../../stores/authStore";
import { X, Briefcase, Upload } from "lucide-react";
import type { JobAd } from "../../context/EmployerContext";

type Props = {
  ad?: JobAd;
  open: boolean;
  onClose: () => void;
};

export default function EditJobAdModal({ ad, open, onClose }: Props) {
  const { updateJobAd } = useEmployer();
  const { token } = useAuthStore();
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
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [benefitInput, setBenefitInput] = useState("");
  const [experience, setExperience] = useState("entry");

  useEffect(() => {
    console.log('EditJobAdModal received ad:', ad);
    if (ad) {
      // Parse salary correctly
      let salaryDisplay = '';
      if (typeof ad.salary === 'string') {
        salaryDisplay = ad.salary;
      } else if (ad.salary && typeof ad.salary === 'object') {
        if (ad.salary.min && ad.salary.max) {
          salaryDisplay = `${ad.salary.min}-${ad.salary.max} ${ad.salary.currency || 'RON'}`;
        } else if (ad.salary.min) {
          salaryDisplay = `${ad.salary.min} ${ad.salary.currency || 'RON'}`;
        } else if (ad.salary.max) {
          salaryDisplay = `până la ${ad.salary.max} ${ad.salary.currency || 'RON'}`;
        }
      }

      // Map type correctly from backend to frontend
      let mappedType = ad.type || "";
      if (mappedType === 'fulltime') mappedType = 'Full-time';
      else if (mappedType === 'parttime') mappedType = 'Part-time';
      else if (mappedType === 'contract') mappedType = 'Proiect';
      else if (mappedType === 'internship') mappedType = 'Ocazional';
      else if (mappedType === 'seasonal') mappedType = 'Sezonier';

      setForm({
        title: ad.title || "",
        requirements: ad.requirements || ad.description || "",
        location: ad.location || "",
        type: mappedType,
        salary: salaryDisplay,
        domain: ad.domain || ad.category || "",
        image: ad.image || "",
      });
      setImgPreview(ad.image || null);
      setSkills(ad.skills || []);
      setBenefits(ad.benefits || []);
      setExperience(ad.experience || "entry");
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

  // Handlers for skills and benefits
  const handleSkillAdd = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };
  const handleSkillRemove = (s: string) => setSkills(skills.filter(x => x !== s));
  const handleBenefitAdd = () => {
    if (benefitInput.trim() && !benefits.includes(benefitInput.trim())) {
      setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput("");
    }
  };
  const handleBenefitRemove = (b: string) => setBenefits(benefits.filter(x => x !== b));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== HANDLE SUBMIT START ===');
    console.log('Ad object:', ad);
    console.log('Ad ID:', ad?.id);
    console.log('Form data:', form);
    console.log('Skills:', skills);
    console.log('Benefits:', benefits);
    console.log('Experience:', experience);
    console.log('Token from useAuthStore:', token ? 'exists' : 'missing');
    
    if (!ad?.id) {
      setError('ID-ul job-ului nu a fost găsit');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await updateJobAd({ 
        ...form, 
        id: ad.id,
        skills,
        benefits,
        experience
      });
      onClose();
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
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
          <select
            className="border rounded-lg px-3 py-2 w-full text-base focus:ring-2 focus:ring-green-500"
            value={experience}
            onChange={e => setExperience(e.target.value)}
          >
            <option value="entry">Fără experiență</option>
            <option value="junior">1–2 ani experiență într-un rol similar</option>
            <option value="mid">Minim 3 ani experiență în domeniu</option>
            <option value="senior">Experiență medie (2–5 ani)</option>
            <option value="lead">Experiență avansată (&gt;5 ani)</option>
          </select>
          <div>
            <label className="block font-medium mb-1">Competențe</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="border rounded-lg px-4 py-2 flex-1"
                placeholder="Adaugă competență"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSkillAdd(); } }}
              />
              <button type="button" onClick={handleSkillAdd} className="bg-green-500 text-white px-3 py-1 rounded">Adaugă</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s} className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                  {s} <button type="button" onClick={() => handleSkillRemove(s)} className="ml-1 text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Beneficii</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="border rounded-lg px-4 py-2 flex-1"
                placeholder="Adaugă beneficiu"
                value={benefitInput}
                onChange={e => setBenefitInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleBenefitAdd(); } }}
              />
              <button type="button" onClick={handleBenefitAdd} className="bg-green-500 text-white px-3 py-1 rounded">Adaugă</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {benefits.map(b => (
                <span key={b} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                  {b} <button type="button" onClick={() => handleBenefitRemove(b)} className="ml-1 text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>
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
