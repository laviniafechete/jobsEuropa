import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";
import { API_BASE_URL } from "../../config/env";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Edit, 
  Save, 
  X,
  Calendar,
  GraduationCap,
  Languages,
  Car,
  FileText,
  Globe,
  Euro
} from "lucide-react";
import PhoneInput from '../../components/PhoneInput';

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

const getEducationLabel = (value: string) => {
  const option = educationOptions.find(opt => opt.value === value);
  return option ? option.label : value;
};

const getSalaryLabel = (value: string) => {
  const option = salaryOptions.find(opt => opt.value === value);
  return option ? option.label : value;
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

// Get base URL without /api
const getImageBaseUrl = () => {
  if (API_BASE_URL.includes('localhost')) {
    return 'http://localhost:5001';
  }
  // For production, use HTTPS
  return 'https://www.jobs-europa.com';
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cvData, setCvData] = useState<any>(null);
  const [isLoadingCV, setIsLoadingCV] = useState(false);
  const hasLoadedCV = useRef(false);
  const [cvImageUrl, setCvImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const [userLanguages, setUserLanguages] = useState<Array<{id: string, language: string, level: string, customLanguage?: string}>>([]);
  const [newLanguage, setNewLanguage] = useState({ language: "", level: "", customLanguage: "" });

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showError('Doar fișiere imagine sunt permise (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Fișierul este prea mare. Dimensiunea maximă este 5MB');
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/cv/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload response:', data);
        console.log('Setting cvImageUrl to:', data.data.imageUrl);
        setCvImageUrl(data.data.imageUrl);
        showSuccess('Imagine CV încărcată cu succes!');
        
        // Force re-render to show the image immediately
        setTimeout(() => {
          console.log('Force re-setting cvImageUrl to:', data.data.imageUrl);
          setCvImageUrl(data.data.imageUrl);
        }, 100);
      } else {
        const errorData = await response.json();
        showError(errorData.message || 'Eroare la încărcarea imaginii');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showError('Eroare la încărcarea imaginii');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!cvImageUrl) return;

    try {
      const response = await fetch(`${API_BASE_URL}/cv/delete-image`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCvImageUrl(null);
        showSuccess('Imagine CV ștearsă cu succes!');
      } else {
        const errorData = await response.json();
        showError(errorData.message || 'Eroare la ștergerea imaginii');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      showError('Eroare la ștergerea imaginii');
    }
  };

  useEffect(() => {
    // Load CV data if user has completed CV and we haven't loaded it yet
    if (user?.hasCompletedCv && !hasLoadedCV.current && !isLoadingCV) {
      loadCVData();
    }
    
    // Debug logging for CV image
    if (cvImageUrl) {
      console.log('CV Image URL changed to:', cvImageUrl);
      console.log('Full image URL:', `${getImageBaseUrl()}${cvImageUrl}`);
    }
  }, [user, cvImageUrl]);

  const loadCVData = async () => {
    if (!token || isLoadingCV || hasLoadedCV.current) return;
    
    setIsLoadingCV(true);
    hasLoadedCV.current = true;
    
    try {
      const response = await fetch(`${API_BASE_URL}/cv/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('CV Data response:', data);
        setCvData(data.data.cv);
        
        // Load CV image URL from user data
        if (data.data.user?.cvImageUrl) {
          console.log('Setting CV image URL:', data.data.user.cvImageUrl);
          setCvImageUrl(data.data.user.cvImageUrl);
        } else {
          console.log('No CV image URL found in response');
        }
        
        // Pre-populate form with existing data
        if (data.data.cv) {
          const cv = data.data.cv;
          
          // Parse phone number
          let phoneData = { prefix: '+40', number: '' };
          if (cv.personalInfo?.phone) {
            const phone = cv.personalInfo.phone;
            if (phone.startsWith('+40')) {
              phoneData = {
                prefix: '+40',
                number: phone.substring(3)
              };
            } else if (phone.startsWith('40')) {
              phoneData = {
                prefix: '+40',
                number: phone.substring(2)
              };
            } else {
              phoneData = {
                prefix: '+40',
                number: phone
              };
            }
          }
          
          // Parse languages
          const languages = cv.skills?.languages?.map((lang: any, index: number) => ({
            id: index.toString(),
            language: lang.language,
            level: lang.level,
            customLanguage: lang.language
          })) || [];
          
          // Parse interest domains
          const interestDomains = cv.preferences?.interestDomains || [];
          
          setFormData({
            experience: cv.professional?.experience || "",
            skills: cv.skills?.technical?.join(", ") || "",
            education: cv.professional?.education || "",
            languages: "",
            availability: cv.preferences?.availability || "",
            location: cv.personalInfo?.location || "",
            phone: phoneData,
            birthDate: cv.personalInfo?.dateOfBirth ? new Date(cv.personalInfo.dateOfBirth).toISOString().split('T')[0] : "",
            gender: cv.personalInfo?.gender || "",
            drivingLicense: cv.documents?.drivingLicense || false,
            hasPassport: cv.documents?.hasPassport || false,
            willingToRelocate: cv.documents?.willingToRelocate || false,
            salaryExpectation: cv.preferences?.salaryExpectation || "",
            additionalInfo: cv.additionalInfo || ""
          });
          
          setUserLanguages(languages);
        }
      } else {
        console.error("Failed to load CV data:", response.status);
      }
    } catch (error) {
      console.error("Error loading CV data:", error);
    } finally {
      setIsLoadingCV(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async () => {
    if (isLoading) return;
    
    if (!token) {
      showError("Nu ești autentificat. Te rugăm să te loghezi din nou.");
      navigate("/employee/login");
      return;
    }
    
    setIsLoading(true);

    try {
      // Prepare languages data
      const languages = userLanguages.map(lang => ({
        language: lang.language === "custom" ? lang.customLanguage : getLanguageLabel(lang.language),
        level: lang.level
      }));

      const payload = {
        ...formData,
        phone: formData.phone.prefix + formData.phone.number,
        languages: languages,
        interestDomains: [], // Will be populated from skills if needed
        userId: user?.userId,
      };

      const response = await fetch(`${API_BASE_URL}/cv/save`, {
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
      
      // Update user in store
      updateUser({
        hasCompletedCv: true,
      });
      
      // Reset CV loading flag to allow reload
      hasLoadedCV.current = false;
      
      // Reload CV data
      await loadCVData();
      
      showSuccess("Profilul a fost actualizat cu succes!");
      setIsEditing(false);
    } catch (error: any) {
      showError(error.message || "Eroare la salvarea profilului. Vă rugăm încercați din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (cvData) {
      // Parse phone number
      let phoneData = { prefix: '+40', number: '' };
      if (cvData.personalInfo?.phone) {
        const phone = cvData.personalInfo.phone;
        if (phone.startsWith('+40')) {
          phoneData = {
            prefix: '+40',
            number: phone.substring(3)
          };
        } else if (phone.startsWith('40')) {
          phoneData = {
            prefix: '+40',
            number: phone.substring(2)
          };
        } else {
          phoneData = {
            prefix: '+40',
            number: phone
          };
        }
      }
      
      // Parse languages
      const languages = cvData.skills?.languages?.map((lang: any, index: number) => ({
        id: index.toString(),
        language: lang.language,
        level: lang.level,
        customLanguage: lang.language
      })) || [];
      
      setFormData({
        experience: cvData.professional?.experience || "",
        skills: cvData.skills?.technical?.join(", ") || "",
        education: cvData.professional?.education || "",
        languages: "",
        availability: cvData.preferences?.availability || "",
        location: cvData.personalInfo?.location || "",
        phone: phoneData,
        birthDate: cvData.personalInfo?.dateOfBirth ? new Date(cvData.personalInfo.dateOfBirth).toISOString().split('T')[0] : "",
        gender: cvData.personalInfo?.gender || "",
        drivingLicense: cvData.documents?.drivingLicense || false,
        hasPassport: cvData.documents?.hasPassport || false,
        willingToRelocate: cvData.documents?.willingToRelocate || false,
        salaryExpectation: cvData.preferences?.salaryExpectation || "",
        additionalInfo: cvData.additionalInfo || ""
      });
      
      setUserLanguages(languages);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.hasCompletedCv 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.hasCompletedCv ? 'CV Completat' : 'CV Incomplet'}
                  </span>
                  <span>Membru din {new Date(user.createdAt).toLocaleDateString('ro-RO')}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
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

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Informații personale
              </h2>
              
              {/* CV Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poza CV
                </label>
                <div className="flex items-center gap-4">
                  {cvImageUrl ? (
                    <div className="relative">
                      <img
                        src={`${getImageBaseUrl()}${cvImageUrl}`}
                        alt="CV"
                        className="w-24 h-24 rounded-lg object-cover border"
                        onError={(e) => {
                          console.error('Error loading CV image:', e);
                          e.currentTarget.style.display = 'none';
                        }}
                        onLoad={() => console.log('CV image loaded successfully')}
                      />
                      {isEditing && (
                        <button
                          onClick={handleDeleteImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          title="Șterge imaginea"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  {isEditing && (
                    <div className="flex flex-col gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isUploadingImage ? 'Se încarcă...' : cvImageUrl ? 'Schimbă imaginea' : 'Adaugă imagine'}
                      </button>
                      {cvImageUrl && (
                        <button
                          onClick={handleDeleteImage}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Șterge imaginea
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <PhoneInput
                    label="Telefon"
                    value={formData.phone}
                    onChange={val => setFormData({ ...formData, phone: val })}
                    required
                  />
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
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{cvData?.personalInfo?.phone || "Nu specificat"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{cvData?.personalInfo?.location || "Nu specificat"}</span>
                  </div>
                  {cvData?.personalInfo?.dateOfBirth && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {new Date(cvData.personalInfo.dateOfBirth).toLocaleDateString('ro-RO')}
                      </span>
                    </div>
                  )}
                  {cvData?.personalInfo?.gender && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {cvData.personalInfo.gender === 'male' ? 'Masculin' : 
                         cvData.personalInfo.gender === 'female' ? 'Feminin' : 'Altul'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Informații profesionale
              </h2>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experiență profesională
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descrie experiența ta profesională..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aptitudini
                    </label>
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Aptitudini, competențe..."
                    />
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
                      {educationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
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
                </div>
              ) : (
                <div className="space-y-4">
                  {cvData?.professional?.experience && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Experiență</h3>
                      <p className="text-gray-700">{cvData.professional.experience}</p>
                    </div>
                  )}
                  {cvData?.skills?.technical?.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Aptitudini</h3>
                      <div className="flex flex-wrap gap-2">
                        {cvData.skills.technical.map((skill: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {cvData?.professional?.education && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Educație</h3>
                      <p className="text-gray-700">{getEducationLabel(cvData.professional.education)}</p>
                    </div>
                  )}
                  {cvData?.skills?.languages?.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Limbi străine</h3>
                      <div className="flex flex-wrap gap-2">
                        {cvData.skills.languages.map((lang: any, index: number) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            {lang.language} ({lang.level})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferințe</h2>
              
              {isEditing ? (
                <div className="space-y-4">
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
                        {salaryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
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
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Disponibilitate</h3>
                      <p className="text-gray-700">{cvData?.preferences?.availability || "Nu specificat"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Așteptări salariale</h3>
                      <p className="text-gray-700">
                        {cvData?.preferences?.salaryExpectation 
                          ? getSalaryLabel(cvData.preferences.salaryExpectation)
                          : "Nu specificat"
                        }
                      </p>
                    </div>
                  </div>
                  
                  {/* Documents */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Documente</h3>
                    <div className="space-y-2">
                      {cvData?.documents?.drivingLicense && (
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">Permis de conducere</span>
                        </div>
                      )}
                      {cvData?.documents?.hasPassport && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">Carte de identitate / Pașaport valid</span>
                        </div>
                      )}
                      {cvData?.documents?.willingToRelocate && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">Dispus să se mute</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Info */}
            {cvData?.additionalInfo && (
              <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informații suplimentare</h2>
                
                {isEditing ? (
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Orice alte informații relevante..."
                  />
                ) : (
                  <p className="text-gray-700">{cvData.additionalInfo}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate("/employee/jobs")}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Vezi joburi
          </button>
          <button
            onClick={() => navigate("/employee/home", { state: { fromProfile: true } })}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Pagina principală
          </button>
        </div>
      </div>
    </div>
  );
} 