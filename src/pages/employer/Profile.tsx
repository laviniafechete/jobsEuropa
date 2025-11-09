import { useAuthStore } from "../../stores/authStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { API_BASE_URL } from "../../config/env";
import { employerAPI } from "../../services/api";
import {
  Building2,
  Edit,
  Save,
  X,
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  AlertCircle,
} from "lucide-react";
import PhoneInput from "../../components/PhoneInput";

interface FormData {
  name: string;
  cui: string;
  location: string;
  domain: string;
  description: string;
  contactPerson: string;
  position: string;
  email: string;
  phone: { prefix: string; number: string };
  website: string;
}

interface CompanyProfileData {
  name?: string;
  cui?: string;
  location?: string;
  domain?: string;
  description?: string;
  logoUrl?: string;
  contactPerson?: string;
  position?: string;
  email?: string;
  phone?: string;
  website?: string;
}

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
  { value: "altele", label: "Altele" },
];

const getDomainLabel = (value: string) => {
  const option = DOMAINS.find((opt) => opt.value === value);
  return option ? option.label : value;
};

interface EmployerProfileResponse {
  success: boolean;
  data: {
    companyProfile?: CompanyProfileData;
  };
  error?: {
    message?: string;
  };
}

export default function EmployerProfile() {
  const { token, employer, updateEmployer } = useAuthStore();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [searchParams] = useSearchParams();
  const fromCompletion = searchParams.get("from") === "completion";

  // Profile editing states
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyProfileData | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const hasLoadedCompany = useRef(false);
  const [showCompletionBanner, setShowCompletionBanner] = useState(fromCompletion);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    cui: "",
    location: "",
    domain: "",
    description: "",
    contactPerson: "",
    position: "",
    email: "",
    phone: { prefix: "+40", number: "" },
    website: "",
  });

  const loadCompanyData = useCallback(async () => {
    if (!token || isLoadingCompany || hasLoadedCompany.current) {
      return;
    }

    setIsLoadingCompany(true);
    hasLoadedCompany.current = true;

    try {
      const response = await fetch(`${API_BASE_URL}/employers/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      const data: EmployerProfileResponse = await response.json();
      const company = data.data.companyProfile;

      setCompanyData(company || null);

      if (company) {
        let phoneData = { prefix: "+40", number: "" };
        if (company.phone) {
          const phone = company.phone;
          if (phone.startsWith("+40")) {
            phoneData = { prefix: "+40", number: phone.substring(3) };
          } else if (phone.startsWith("40")) {
            phoneData = { prefix: "+40", number: phone.substring(2) };
          } else {
            phoneData = { prefix: "+40", number: phone };
          }
        }

        setFormData({
          name: company.name || "",
          cui: company.cui || "",
          location: company.location || "",
          domain: company.domain || "",
          description: company.description || "",
          contactPerson: company.contactPerson || "",
          position: company.position || "",
          email: company.email || "",
          phone: phoneData,
          website: company.website || "",
        });
      }
    } catch (error) {
      console.error("Error loading company data:", error);
    } finally {
      setIsLoadingCompany(false);
    }
  }, [token, isLoadingCompany]);

  useEffect(() => {
    if (employer?.hasProfileCompleted && !hasLoadedCompany.current && !isLoadingCompany) {
      loadCompanyData();
    }
  }, [employer, isLoadingCompany, loadCompanyData]);

  // Clean URL parameter and manage completion flow
  useEffect(() => {
    if (fromCompletion) {
      // Clean the URL parameter
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("from");
      navigate(`/employer/profile?${newSearchParams.toString()}`, { replace: true });
    }
  }, [fromCompletion, navigate, searchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (isLoading) return;

    if (!token) {
      showError("Nu ești autentificat. Te rugăm să te loghezi din nou.");
      navigate("/employer/login");
      return;
    }

    setIsLoading(true);

    try {
      const phoneString = `${formData.phone.prefix}${formData.phone.number}`;
      const payload = {
        ...formData,
        phone: phoneString,
      };

      const response = await employerAPI.saveCompanyProfile(payload);

      if (!response.success) {
        if (response.error?.message?.includes("token")) {
          showError("Sesiunea a expirat. Te rugăm să te loghezi din nou.");
          navigate("/employer/login");
          return;
        }
        throw new Error(response.error?.message || "Eroare la salvarea profilului");
      }

      // Update employer in store
      if (updateEmployer) {
        updateEmployer({
          ...employer,
          hasProfileCompleted: true,
          companyProfile: response.data?.companyProfile,
        });
      }

      // Reset company loading flag to allow reload
      hasLoadedCompany.current = false;

      // Reload company data
      await loadCompanyData();

      showSuccess("Profilul companiei a fost actualizat cu succes!");
      setIsEditing(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Eroare la salvarea profilului. Vă rugăm încercați din nou.";
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (companyData) {
      // Parse phone number
      let phoneData = { prefix: "+40", number: "" };
      if (companyData.phone) {
        const phone = companyData.phone;
        if (phone.startsWith("+40")) {
          phoneData = {
            prefix: "+40",
            number: phone.substring(3),
          };
        } else if (phone.startsWith("40")) {
          phoneData = {
            prefix: "+40",
            number: phone.substring(2),
          };
        } else {
          phoneData = {
            prefix: "+40",
            number: phone,
          };
        }
      }

      setFormData({
        name: companyData.name || "",
        cui: companyData.cui || "",
        location: companyData.location || "",
        domain: companyData.domain || "",
        description: companyData.description || "",

        contactPerson: companyData.contactPerson || "",
        position: companyData.position || "",
        email: companyData.email || "",
        phone: phoneData,
        website: companyData.website || "",
      });
    }
    setIsEditing(false);
  };

  if (!employer) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{employer.companyName}</h1>
                <p className="text-gray-600">{employer.email}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      employer.hasProfileCompleted
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {employer.hasProfileCompleted ? "Profil Completat" : "Profil Incomplet"}
                  </span>
                  <span>Membru din {new Date(employer.createdAt).toLocaleDateString("ro-RO")}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                >
                  <Edit className="w-4 h-4" />
                  Editează profilul
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    <X className="w-4 h-4" />
                    Anulează
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? "Se salvează..." : "Salvează"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Completion Banner */}
        {showCompletionBanner && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-blue-900 font-semibold mb-1">Completează profilul companiei</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Pentru a posta job-uri și a primi aplicații relevante, completează informațiile
                  despre compania ta. Poți vizualiza mai jos toate câmpurile disponibile și apoi le
                  poți edita.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowCompletionBanner(false);
                    }}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                  >
                    Editează acum
                  </button>
                  <button
                    onClick={() => setShowCompletionBanner(false)}
                    className="px-3 py-1.5 text-blue-600 text-sm rounded-lg hover:bg-blue-100 transition"
                  >
                    Am înțeles
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-600" />
                Informații companie
              </h2>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nume companie *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CUI / BCE
                      </label>
                      <input
                        type="text"
                        name="cui"
                        value={formData.cui}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Număr de înregistrare"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Domeniul de activitate
                      </label>
                      <select
                        name="domain"
                        value={formData.domain}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        {DOMAINS.map((domain) => (
                          <option key={domain.value} value={domain.value}>
                            {domain.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresa sediului
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Adresa sediului"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descriere companie
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Descriere scurtă companie"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {companyData?.name && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Denumirea firmei</h3>
                      <p className="text-gray-700">{companyData.name}</p>
                    </div>
                  )}
                  {companyData?.cui && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">CUI / BCE</h3>
                      <p className="text-gray-700">{companyData.cui}</p>
                    </div>
                  )}
                  {companyData?.domain && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Domeniul de activitate</h3>
                      <p className="text-gray-700">{getDomainLabel(companyData.domain)}</p>
                    </div>
                  )}
                  {companyData?.location && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Adresa sediului</h3>
                      <p className="text-gray-700">{companyData.location}</p>
                    </div>
                  )}
                  {companyData?.description && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Descriere companie</h3>
                      <p className="text-gray-700">{companyData.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Informații contact
              </h2>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Persoană de contact
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Nume și prenume"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Funcția în firmă
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="ex: HR, Manager, Admin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email de contact
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Email de contact"
                    />
                  </div>

                  <PhoneInput
                    label="Telefon (WhatsApp)"
                    value={formData.phone}
                    onChange={(val) => setFormData({ ...formData, phone: val })}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Website (opțional)"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{employer.email}</span>
                  </div>
                  {companyData?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{companyData.phone}</span>
                    </div>
                  )}
                  {companyData?.contactPerson && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{companyData.contactPerson}</span>
                    </div>
                  )}
                  {companyData?.position && (
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{companyData.position}</span>
                    </div>
                  )}
                  {companyData?.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{companyData.website}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate("/employer/home")}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            Pagina principală
          </button>
          <button
            onClick={() => navigate("/employer/post-job")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Postează job
          </button>
        </div>
      </div>
    </div>
  );
}
