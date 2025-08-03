import React, { useState, useEffect } from "react";
import { Building2, Upload } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/env";
import PhoneInput from '../../components/PhoneInput';

type Company = {
  name: string;
  cui: string;
  location: string;
  domain: string;
  description: string;
  logoUrl?: string;
  contactPerson?: string;
  position?: string;
  email?: string;
  phone?: string;
  website?: string;
};

type Props = {
  onSuccess?: () => void;
  initialData?: Company;
  onSave?: (company: Company) => void;
};

export default function CompanyForm({ onSuccess = () => {}, initialData, onSave }: Props) {
  const { token, employer, updateEmployer } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();
  const [form, setForm] = useState<Company>(
    initialData || {
      name: "",
      cui: "",
      location: "",
      domain: "",
      description: "",
      logoUrl: "",
      phone: { prefix: '+40', number: '' },
    }
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData?.logoUrl || null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
          fetch(`${API_BASE_URL}/employer/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.companyProfile) {
          setForm({ ...form, ...data.data.companyProfile });
          setLogoPreview(data.data.companyProfile.logoUrl || null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setLogoPreview(initialData.logoUrl || null);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      setForm((f) => ({ ...f, logoUrl: url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showError("Nu ești autentificat");
      return;
    }
    try {
      const payload = {
        ...form,
        phone: form.phone.prefix + form.phone.number,
      };
      const response = await fetch(`${API_BASE_URL}/employer/save-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        showError(errorData.error?.message || "Eroare la salvarea profilului");
        return;
      }
      const data = await response.json();
      showSuccess("Profilul companiei a fost salvat cu succes!");
      // Fetch employer profile again to update hasProfileCompleted
      try {
        const profileRes = await fetch(`${API_BASE_URL}/employer/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        if (profileData.success && profileData.data) {
          if (updateEmployer) updateEmployer({ ...profileData.data });
        }
      } catch (e) { /* ignore */ }
      if (onSave) onSave(form);
      onSuccess();
      setTimeout(() => navigate("/employer/home"), 500);
    } catch (err: any) {
      showError(err.message || "Eroare la salvarea profilului");
    }
  };

  if (loading) return <div className="p-8">Se încarcă...</div>;

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 mt-20">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Building2 className="text-green-600" /> Profil companie
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          className="border rounded-lg px-4 py-2"
          placeholder="Denumirea firmei"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="cui"
          className="border rounded-lg px-4 py-2"
          placeholder="Număr de înregistrare (CUI / BCE)"
          value={form.cui}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          className="border rounded-lg px-4 py-2"
          placeholder="Adresa sediului"
          value={form.location}
          onChange={handleChange}
          required
        />
        <input
          name="contactPerson"
          className="border rounded-lg px-4 py-2"
          placeholder="Persoană de contact - Nume și prenume"
          value={(form as any).contactPerson || ""}
          onChange={handleChange}
        />
        <input
          name="position"
          className="border rounded-lg px-4 py-2"
          placeholder="Funcția în firmă (ex: HR, Manager, Admin)"
          value={(form as any).position || ""}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          className="border rounded-lg px-4 py-2"
          placeholder="Email de contact"
          value={(form as any).email || ""}
          onChange={handleChange}
        />
        <PhoneInput
          label="Telefon (WhatsApp)"
          value={typeof form.phone === 'string' ? { prefix: form.phone.substring(0, 3) || '+40', number: form.phone.substring(3) || '' } : form.phone}
          onChange={val => setForm({ ...form, phone: val })}
          required
        />
        <input
          name="website"
          className="border rounded-lg px-4 py-2"
          placeholder="Website (opțional)"
          value={(form as any).website || ""}
          onChange={handleChange}
        />
        <input
          name="domain"
          className="border rounded-lg px-4 py-2"
          placeholder="Domeniul de activitate"
          value={form.domain}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          className="border rounded-lg px-4 py-2"
          placeholder="Descriere scurtă companie"
          value={form.description}
          onChange={handleChange}
          required
        />
        <label className="flex items-center gap-2 cursor-pointer">
          <Upload className="text-green-600" />
          <span>Logo companie (opțional)</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogo}
          />
        </label>
        {logoPreview && (
          <img
            src={logoPreview}
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover mx-auto border"
          />
        )}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Salvează profilul
        </button>
      </form>
    </div>
  );
}
