import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Upload, Edit } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import JobAdCard from "./JobAdCard";
import { API_BASE_URL } from "../../config/env";
import EditJobAdModal from "./EditJobAdModal";
import { useSnackbar } from "../../hooks/useSnackbar";

export default function PostJobForm() {
  const { employer, token } = useAuthStore();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
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
  const [editAd, setEditAd] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobAds, setJobAds] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [benefitInput, setBenefitInput] = useState("");
  const [salary, setSalary] = useState({ min: "", max: "", currency: "RON" });
  const [experience, setExperience] = useState("entry");

  useEffect(() => {
    if (!token) return;
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/jobs/employer/my-jobs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setJobAds(data.data.jobs || []);
        }
      } catch (e) { /* ignore */ }
    };
    fetchJobs();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImgPreview(url);
      setForm((f) => ({ ...f, image: url }));
    }
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
    setIsSubmitting(true);
    setError(null);
    
    if (!token) {
      setError("Nu ești autentificat");
      showError("Nu ești autentificat");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const typeMap: Record<string, string> = {
        "Full-time": "full-time",
        "Part-time": "part-time",
        "Ocazional": "contract",
        "Proiect": "contract",
        "Sezonier": "contract"
      };
      // Map frontend fields to backend fields
      const jobData = {
        title: form.title,
        description: form.requirements,
        requirements: form.requirements,
        location: form.location,
        type: typeMap[form.type] || "full-time",
        category: form.domain,
        salary: {
          min: Number(salary.min) || undefined,
          max: Number(salary.max) || undefined,
          currency: salary.currency || "RON"
        },
        experience,
        skills,
        benefits
      };

              const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        showError(errorData.error?.message || 'Eroare la crearea job-ului');
        throw new Error(errorData.error?.message || 'Eroare la crearea job-ului');
      }

      const result = await response.json();
      // Adaug jobul nou în lista locală
      setJobAds(prev => [...prev, result.data]);
      // Reset form
      setForm({
        title: "",
        requirements: "",
        location: "",
        type: "",
        salary: "",
        domain: "",
        image: "",
      });
      setImgPreview(null);
      setSkills([]);
      setBenefits([]);
      setSalary({ min: "", max: "", currency: "RON" });
      setExperience("entry");
      showSuccess("Job publicat cu succes!");
      // Nu mai fac redirect
    } catch (error: any) {
      console.error('Error submitting job:', error);
      setError(error.message || 'Eroare la publicarea anunțului');
      showError(error.message || 'Eroare la publicarea anunțului');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determin dacă are acces la funcție
  const canUsePremium = employer && ((employer.trialEnd && new Date(employer.trialEnd) > new Date()) || employer.subscriptionActive);

  if (!canUsePremium) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 px-2 sm:px-4">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Briefcase className="text-green-600" /> Postează anunț de angajare
        </h2>
        <div className="text-center text-red-500 text-lg mt-8">
          Acces restricționat. Activează un abonament pentru a folosi această funcție.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 px-2 sm:px-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Briefcase className="text-green-600" /> Postează anunț de angajare
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
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
        <div className="flex gap-2">
          <input
            type="number"
            className="border rounded-lg px-4 py-2 w-1/3"
            placeholder="Salariu minim"
            value={salary.min}
            onChange={e => setSalary(s => ({ ...s, min: e.target.value }))}
          />
          <input
            type="number"
            className="border rounded-lg px-4 py-2 w-1/3"
            placeholder="Salariu maxim"
            value={salary.max}
            onChange={e => setSalary(s => ({ ...s, max: e.target.value }))}
          />
          <select
            className="border rounded-lg px-3 py-2 w-1/3"
            value={salary.currency}
            onChange={e => setSalary(s => ({ ...s, currency: e.target.value }))}
          >
            <option value="RON">RON</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>
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
          <option value="entry">Entry</option>
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
          <option value="lead">Lead</option>
        </select>
        <div>
          <label className="block font-medium mb-1">Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="border rounded-lg px-4 py-2 flex-1"
              placeholder="Adaugă skill"
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
        <label className="flex items-center gap-2 cursor-pointer">
          <Upload className="text-green-600" />
          <span>Imagine job (opțional)</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
          />
        </label>
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
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center"
        >
          {isSubmitting ? 'Se publică...' : 'Publică anunțul'}
        </button>
      </form>
      {/* Lista anunțuri publicate */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Edit className="text-green-600" /> Anunțurile tale publicate
        </h3>
        <div className="flex flex-col gap-6">
          {jobAds.length === 0 && (
            <div className="text-gray-500 text-center">
              Nu ai publicat niciun anunț încă.
            </div>
          )}
          {jobAds.slice().reverse().map((ad: any) => (
            <JobAdCard key={ad.id} ad={ad} onEdit={() => setEditAd(ad.id)} />
          ))}
        </div>
      </div>
      <EditJobAdModal
        ad={jobAds.find((a: any) => a.id === editAd)}
        open={!!editAd}
        onClose={() => setEditAd(null)}
      />
    </div>
  );
}
