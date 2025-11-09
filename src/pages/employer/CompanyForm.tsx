import React, { useState, useEffect, useCallback } from "react";
import { Building2 } from "lucide-react";
import { useAuthStore, CompanyProfile } from "../../stores/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useNavigate } from "react-router-dom";
import PhoneInput from "../../components/PhoneInput";
import { employerAPI, EmployerCompanyProfilePayload } from "../../services/api";

const DOMAINS = [
  { value: "", label: "Selectează domeniul de activitate" },
  { value: "constructii", label: "Construcții" },
  { value: "menaj", label: "Menaj / Curățenie" },
  { value: "ingrijire", label: "Îngrijire bătrâni / Copii" },
  { value: "agricultura", label: "Agricultură / Grădinărit" },
  { value: "transport", label: "Transport / Livrări" },
  { value: "sudura", label: "Sudură și prelucrări metal" },
  { value: "comert", label: "Comerț / Casierie / Retail" },
  { value: "it", label: "IT / Tehnologie" },
  { value: "call-center", label: "Call center / Lucru de birou" },
  { value: "educatie", label: "Educație / Meditații" },
  { value: "sanatate", label: "Sănătate / Farmacie" },
  { value: "horeca", label: "HoReCa / Bucătărie" },
  { value: "altele", label: "Altele" }
];

type PhoneValue = { prefix: string; number: string };

interface CompanyFormState {
  name: string;
  cui: string;
  location: string;
  domain: string;
  description: string;
  contactPerson: string;
  position: string;
  email: string;
  phone: PhoneValue;
  website: string;
}

interface CompanyFormProps {
  onSuccess?: () => void;
  initialData?: CompanyProfile;
  onSave?: (company: CompanyFormState) => void;
}

const DEFAULT_PHONE: PhoneValue = { prefix: "+40", number: "" };

const convertPhone = (value?: string | PhoneValue): PhoneValue => {
  if (!value) {
    return DEFAULT_PHONE;
  }

  if (typeof value === "string") {
    const normalized = value.startsWith("+") ? value : `+${value}`;
    const prefix = normalized.slice(0, 3) || "+40";
    const number = normalized.slice(3);
    return { prefix, number };
  }

  return {
    prefix: value.prefix || DEFAULT_PHONE.prefix,
    number: value.number || DEFAULT_PHONE.number
  };
};

const mapInitialData = (data?: CompanyProfile): CompanyFormState => ({
  name: data?.name || "",
  cui: data?.cui || "",
  location: data?.location || "",
  domain: data?.domain || "",
  description: data?.description || "",
  contactPerson: data?.contactPerson || "",
  position: data?.position || "",
  email: data?.email || "",
  phone: convertPhone(data?.phone),
  website: data?.website || ""
});

export default function CompanyForm({
  onSuccess = () => {},
  initialData,
  onSave
}: CompanyFormProps) {
  const { token, updateEmployer } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();
  const [form, setForm] = useState<CompanyFormState>(mapInitialData(initialData));
  const [loading, setLoading] = useState(false);

  const loadCompanyProfile = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await employerAPI.getCompanyProfile();
      if (response.success && response.data?.companyProfile) {
        setForm(mapInitialData(response.data.companyProfile));
      }
    } catch {
      // ignore fetch errors, feedback already shown elsewhere
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCompanyProfile();
  }, [loadCompanyProfile]);

  useEffect(() => {
    if (initialData) {
      setForm(mapInitialData(initialData));
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showError("Nu ești autentificat");
      return;
    }

    try {
      const phoneString = `${form.phone.prefix}${form.phone.number}`;
      const payload: EmployerCompanyProfilePayload = {
        ...form,
        phone: phoneString
      };
      const response = await employerAPI.saveCompanyProfile(payload);
      if (!response.success) {
        showError(response.error?.message || "Eroare la salvarea profilului");
        return;
      }
      showSuccess("Profilul companiei a fost salvat cu succes!");
      // Fetch employer profile again to update hasProfileCompleted
      try {
        const profileData = await employerAPI.getCompanyProfile();
        if (profileData.success && profileData.data && updateEmployer) {
          updateEmployer(profileData.data as CompanyProfile);
        }
      } catch {
        // ignore secondary fetch errors
      }
      if (onSave) onSave(form);
      onSuccess();
      setTimeout(() => navigate("/employer/home"), 500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Eroare la salvarea profilului";
      showError(message);
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
          value={form.contactPerson}
          onChange={handleChange}
        />
        <input
          name="position"
          className="border rounded-lg px-4 py-2"
          placeholder="Funcția în firmă (ex: HR, Manager, Admin)"
          value={form.position}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          className="border rounded-lg px-4 py-2"
          placeholder="Email de contact"
          value={form.email}
          onChange={handleChange}
        />
        <PhoneInput
          label="Telefon (WhatsApp)"
          value={form.phone}
          onChange={val => setForm(prev => ({ ...prev, phone: val }))}
          required
        />
        <input
          name="website"
          className="border rounded-lg px-4 py-2"
          placeholder="Website (opțional)"
          value={form.website}
          onChange={handleChange}
        />
        <select
          name="domain"
          className="border rounded-lg px-4 py-2 w-full"
          value={form.domain}
          onChange={handleChange}
          required
        >
          {DOMAINS.map((domain) => (
            <option key={domain.value} value={domain.value}>
              {domain.label}
            </option>
          ))}
        </select>
        <textarea
          name="description"
          className="border rounded-lg px-4 py-2"
          placeholder="Descriere scurtă companie"
          value={form.description}
          onChange={handleChange}
          required
        />

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
