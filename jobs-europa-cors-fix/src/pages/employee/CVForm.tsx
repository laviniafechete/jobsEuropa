import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";
import PhoneInput from '../../components/PhoneInput';
import { API_BASE_URL } from "../../config/env";

const educationOptions = [
  { value: "", label: "Selectează nivelul de educație" },
  { value: "fara-studii", label: "Fără studii" },
  { value: "scoala-primara", label: "Școala primară" },
  { value: "gimnaziu", label: "Gimnaziu" },
  { value: "liceu-profesional", label: "Liceu / Școală profesională" },
  { value: "liceu-bacalaureat", label: "Liceu – Bacalaureat" },
  { value: "scoala-postliceala", label: "Școală postliceală" },
  { value: "facultate-licenta", label: "Facultate (licență)" },
  { value: "studii-superioare", label: "Studii superioare (master, doctorat)" },
];

const salaryOptions = [
  { value: "", label: "Selectează așteptările salariale" },
  { value: "sub-1000", label: "<1000 euro" },
  { value: "1000-2000", label: "1000-2000 euro" },
  { value: "2000-3000", label: "2000-3000 euro" },
  { value: "peste-3000", label: ">3000 euro" },
  { value: "negociabil", label: "Negociabil" },
];

const languageOptions = [
  { value: "engleza", label: "Engleză" },
  { value: "franceza", label: "Franceză" },
  { value: "germana", label: "Germană" },
  { value: "spaniola", label: "Spaniolă" },
  { value: "italiana", label: "Italiană" },
  { value: "olandeza", label: "Olandeză" },
  { value: "rusa", label: "Rusă" },
  { value: "custom", label: "Altă limbă..." },
];

const levelOptions = [
  { value: "incepator", label: "Începător" },
  { value: "conversational", label: "Conversational" },
  { value: "mediu", label: "Mediu" },
  { value: "avansat", label: "Avansat" },
  { value: "nativ", label: "Nativ" },
];

const interestDomains = [
  { value: "constructii", label: "🧱 Construcții și amenajări" },
  { value: "electricitate", label: "🔌 Electricitate și instalații" },
  { value: "mecanica", label: "🛠️ Mecanică / Service auto" },
  { value: "transport", label: "🚛 Transport și livrări (curierat, șoferi)" },
  { value: "logistica", label: "📦 Logistică și depozit" },
  { value: "curatenie", label: "🧼 Curățenie și întreținere" },
  { value: "horeca", label: "👩‍🍳 Horeca (bucătari, ospătari, hotel)" },
  { value: "bone", label: "👶 Bone / Îngrijire copii" },
  { value: "ingrijire-batrani", label: "👵 Îngrijire bătrâni / Asistență la domiciliu" },
  { value: "agricultura", label: "🌾 Agricultură și muncă sezonieră" },
  { value: "menaj", label: "🏠 Menaj la domiciliu / Intern" },
  { value: "confectii", label: "🧵 Confecții textile / Croitorie" },
  { value: "necalificat", label: "🧰 Muncă necalificată / Ajutor general" },
  { value: "sudura", label: "🧑‍🏭 Sudură și prelucrări metal" },
  { value: "comert", label: "🛍️ Comerț / Casierie / Retail" },
  { value: "it", label: "🖥️ IT / Tehnologie" },
  { value: "call-center", label: "📞 Call center / Lucru de birou" },
  { value: "educatie", label: "📚 Educație / Meditații" },
  { value: "artizanat", label: "🎨 Lucru manual / Artizanat" },
  { value: "remote", label: "📤 Lucru de acasă / Remote" },
];

export default function EmployeeCVForm() {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  
  const [formData, setFormData] = useState({
    experience: "",
    skills: "",
    education: "",
    languages: "",
    availability: "",
    location: "",
    phone: { prefix: '+40', number: '' },
    birthDate: "",
    gender: "",
    drivingLicense: false,
    hasPassport: false,
    willingToRelocate: false,
    salaryExpectation: "",
    additionalInfo: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [userLanguages, setUserLanguages] = useState<Array<{id: string, language: string, level: string, customLanguage?: string}>>([]);
  const [newLanguage, setNewLanguage] = useState({ language: "", level: "", customLanguage: "" });
  const [interestDomainsList, setInterestDomainsList] = useState<string[]>([]);

  useEffect(() => {
    // Pre-populate form with existing data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        // Add other fields if they exist in user data
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addLanguage = () => {
    if (newLanguage.language && newLanguage.level) {
      const id = Date.now().toString();
      setUserLanguages(prev => [...prev, { ...newLanguage, id }]);
      setNewLanguage({ language: "", level: "", customLanguage: "" });
    }
  };

  const removeLanguage = (id: string) => {
    setUserLanguages(prev => prev.filter(lang => lang.id !== id));
  };

  const getLanguageLabel = (language: string, customLanguage?: string) => {
    if (language === "custom" && customLanguage) {
      return customLanguage;
    }
    const option = languageOptions.find(opt => opt.value === language);
    return option ? option.label : language;
  };

  const getLevelLabel = (level: string) => {
    const option = levelOptions.find(opt => opt.value === level);
    return option ? option.label : level;
  };

  const handleInterestDomainChange = (domainValue: string) => {
    setInterestDomainsList(prev => {
      if (prev.includes(domainValue)) {
        // Remove if already selected
        return prev.filter(d => d !== domainValue);
      } else {
        // Add if not selected and less than 3
        if (prev.length < 3) {
          return [...prev, domainValue];
        }
        return prev; // Don't add if already 3 selected
      }
    });
  };

  const getInterestDomainLabel = (value: string) => {
    const domain = interestDomains.find(d => d.value === value);
    return domain ? domain.label : value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (!token) {
      showError("Nu ești autentificat. Te rugăm să te loghezi din nou.");
      navigate("/employee/login");
      return;
    }
    
    setIsLoading(true);

    try {
      // Real API call to save CV
      const payload = {
        ...formData,
        phone: formData.phone.prefix + formData.phone.number,
        languages: userLanguages.map(lang => ({
          language: lang.language === "custom" ? lang.customLanguage : getLanguageLabel(lang.language),
          level: lang.level
        })),
        interestDomains: interestDomainsList,
        skills: interestDomainsList.map(domain => getInterestDomainLabel(domain)), // For backward compatibility
        userId: user?.userId,
      };

      const response = await fetch(`${API_BASE_URL}/api/cv/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error?.message?.includes("token")) {
          showError("Sesiunea a expirat. Te rugăm să te loghezi din nou.");
          navigate("/employee/login");
          return;
        }
        throw new Error(errorData.message || "Eroare la salvarea CV-ului");
      }

      const result = await response.json();
      
      // Update user in store with hasCompletedCv: true
      updateUser({
        hasCompletedCv: true,
        // Add other CV fields to user data if needed
      });
      
      showSuccess("CV-ul a fost salvat cu succes!");
      navigate("/employee/jobs");
    } catch (error: any) {
      showError(error.message || "Eroare la salvarea CV-ului. Vă rugăm încercați din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              CV-ul meu
            </h1>
            <button
              onClick={() => navigate("/employee/home")}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Înapoi
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informații personale</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <PhoneInput
                    label="Telefon"
                    value={formData.phone}
                    onChange={val => setFormData({ ...formData, phone: val })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data nașterii
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gen
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selectează</option>
                    <option value="male">Masculin</option>
                    <option value="female">Feminin</option>
                    <option value="other">Altul</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Locație
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Oraș, Țară"
                  />
                </div>
              </div>
            </div>

            {/* Experience & Interest Domains */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Experiență și domenii de interes</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experiență profesională
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descrie experiența ta profesională..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Domenii de interes (maxim 3)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {interestDomains.map((domain) => (
                      <label key={domain.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={interestDomainsList.includes(domain.value)}
                          onChange={() => handleInterestDomainChange(domain.value)}
                          disabled={!interestDomainsList.includes(domain.value) && interestDomainsList.length >= 3}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className={`text-sm ${!interestDomainsList.includes(domain.value) && interestDomainsList.length >= 3 ? 'text-gray-400' : 'text-gray-700'}`}>
                          {domain.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {interestDomainsList.length >= 3 && (
                    <p className="text-xs text-blue-600 mt-2">
                      Ai selectat maximul de 3 domenii. Deselectează unul pentru a alege altul.
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Limbi străine
                  </label>
                  
                  {/* Add new language */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                    <select
                      value={newLanguage.language}
                      onChange={(e) => setNewLanguage(prev => ({ ...prev, language: e.target.value, customLanguage: "" }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selectează limba</option>
                      {languageOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    
                    {newLanguage.language === "custom" && (
                      <input
                        type="text"
                        value={newLanguage.customLanguage}
                        onChange={(e) => setNewLanguage(prev => ({ ...prev, customLanguage: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Scrie limba..."
                      />
                    )}
                    
                    <select
                      value={newLanguage.level}
                      onChange={(e) => setNewLanguage(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selectează nivelul</option>
                      {levelOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    
                    <button
                      type="button"
                      onClick={addLanguage}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Adaugă
                    </button>
                  </div>
                  
                  {/* Display added languages */}
                  {userLanguages.length > 0 && (
                    <div className="space-y-2">
                      {userLanguages.map((lang) => (
                        <div key={lang.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <span>
                            <strong>{getLanguageLabel(lang.language, lang.customLanguage)}</strong> - {getLevelLabel(lang.level)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeLanguage(lang.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Educație
                  </label>
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {educationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="drivingLicense"
                    checked={formData.drivingLicense}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Permis de conducere</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasPassport"
                    checked={formData.hasPassport}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Carte de identitate / Pașaport valid</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="willingToRelocate"
                    checked={formData.willingToRelocate}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Sunt dispus să mă mut</span>
                </label>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferințe</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disponibilitate
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selectează</option>
                    <option value="immediate">Imediată</option>
                    <option value="1week">1 săptămână</option>
                    <option value="2weeks">2 săptămâni</option>
                    <option value="1month">1 lună</option>
                    <option value="flexible">Flexibilă</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Așteptări salariale
                  </label>
                  <select
                    name="salaryExpectation"
                    value={formData.salaryExpectation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {salaryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informații suplimentare</h2>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Orice alte informații relevante..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/employee/home")}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Anulează
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
              >
                {isLoading ? "Se salvează..." : "Salvează CV-ul"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
