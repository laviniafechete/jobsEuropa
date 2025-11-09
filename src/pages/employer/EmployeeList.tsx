import React, { useState, useEffect, useMemo, useRef } from "react";
import { Star, User, MapPin, Phone, Mail, BadgeCheck, X } from "lucide-react";
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

const getEducationLabel = (value: string) => {
  const option = educationOptions.find(opt => opt.value === value);
  return option ? option.label : value;
};

const getSalaryLabel = (value: string) => {
  const option = salaryOptions.find(opt => opt.value === value);
  return option ? option.label : value;
};

// --- Terms Modal Component ---
type TermsModalProps = {
  open: boolean;
  onAccept: () => void;
  onClose: () => void;
};

function TermsModal({ open, onAccept, onClose }: TermsModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          onClick={onClose}
          aria-label="Închide"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold mb-4 text-center">
          Termeni și Condiții pentru Contact
        </h3>
        <div className="text-gray-700 text-sm mb-6 max-h-60 overflow-y-auto">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Folosirea datelor de contact ale angajatului este permisă doar
              pentru scopuri de angajare.
            </li>
            <li>
              Este interzisă transmiterea datelor către terți fără acordul
              explicit al angajatului.
            </li>
            <li>
              Respectați confidențialitatea și nu trimiteți mesaje nesolicitate
              sau abuzive.
            </li>
            <li>
              Orice abuz poate duce la restricționarea accesului pe platformă.
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
            onClick={onAccept}
          >
            Accept și vreau să văd datele de contact
          </button>
          <button
            className="text-gray-500 hover:text-red-500 text-sm mt-1"
            onClick={onClose}
          >
            Renunță
          </button>
        </div>
      </div>
    </div>
  );
}

type CvLanguage = {
  language?: string;
  level?: string;
  customLanguage?: string;
};

type CvExperience = {
  position?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  achievements?: string[];
};

type CvEducation = {
  degree?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  field?: string;
  gpa?: number;
};

type CvCertification = {
  name?: string;
  issuer?: string;
  date?: string;
  expiryDate?: string;
  credentialId?: string;
};

type CvDesiredSalary =
  | {
      min?: number;
      max?: number;
      currency?: string;
    }
  | {
      min?: string;
      max?: string;
      currency?: string;
    };

type CvPreferences = {
  workType?: string[];
  availability?: string;
  preferredLocations?: string[];
  industries?: string[];
  desiredSalary?: CvDesiredSalary;
};

type CvSkills = {
  technical?: string[];
  soft?: string[];
  languages?: CvLanguage[];
};

type CvProfessional = {
  title?: string;
  summary?: string;
  experience?: CvExperience[];
  education?: CvEducation[];
};

type CvPersonalInfo = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  profilePicture?: string;
  dateOfBirth?: string;
  nationality?: string;
};

type CvData = {
  personalInfo?: CvPersonalInfo;
  professional?: CvProfessional;
  skills?: CvSkills;
  preferences?: CvPreferences;
  certifications?: CvCertification[];
};

type Employee = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  hasCompletedCv?: boolean;
  isActive?: boolean;
  lastLogin?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  photoUrl?: string;
  cv?: CvData;
};

type EmployeeReview = {
  name: string;
  rating: number;
  text: string;
};

// 2. Adaug state pentru filtrare

type EmployeeModalProps = {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
};

function EmployeeModal({ employee, open, onClose }: EmployeeModalProps) {
  const [reviews, setReviews] = useState<EmployeeReview[]>([]);
  const [form, setForm] = useState<EmployeeReview>({
    name: "",
    rating: 5,
    text: "",
  });

  if (!open || !employee) return null;
  const cv = employee.cv || {};
  const personal = cv.personalInfo || {};
  const professional = cv.professional || {};
  const skills = cv.skills || {};
  const preferences = cv.preferences || {};
  const certifications = cv.certifications || [];

  const formatDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString() : "";

  const renderDesiredSalary = () => {
    const desiredSalary = preferences.desiredSalary;
    if (!desiredSalary) return "Nu specificat";

    if (typeof desiredSalary.min === "string") {
      return getSalaryLabel(desiredSalary.min);
    }

    if (
      typeof desiredSalary.min === "number" &&
      typeof desiredSalary.max === "number"
    ) {
      return `${desiredSalary.min} - ${desiredSalary.max} ${desiredSalary.currency || "EUR"}`;
    }

    if (typeof desiredSalary.min === "number") {
      return `${desiredSalary.min} ${desiredSalary.currency || "EUR"}`;
    }

    if (typeof desiredSalary.max === "number") {
      return `Până la ${desiredSalary.max} ${desiredSalary.currency || "EUR"}`;
    }

    return "Nu specificat";
  };

  const handleReviewSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.text.trim()) {
      return;
    }
    setReviews((prev) => [
      ...prev,
      {
        name: form.name || "Anonim",
        rating: form.rating,
        text: form.text.trim(),
      },
    ]);
    setForm({
      name: "",
      rating: 5,
      text: "",
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          onClick={onClose}
          aria-label="Închide"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center gap-3">
          <img
            src={employee.photoUrl}
            alt={employee.name}
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">{personal.name || employee.name}</span>
            <BadgeCheck className="text-green-500" />
          </div>
          <div className="text-gray-500 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {personal.location || employee.location}
          </div>
          <div className="text-gray-600 text-sm">{professional.title}</div>
          <div className="text-gray-600 text-sm">{professional.summary}</div>
          <div className="flex flex-wrap gap-2 mt-2 mb-2">
            {(skills.technical || []).map((s, i) => (
              <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{s}</span>
            ))}
            {(skills.soft || []).map((s, i) => (
              <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">{s}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {(skills.languages || []).map((language, i) => (
              <span key={i} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                {language.language} ({language.level})
              </span>
            ))}
          </div>
          <div className="text-gray-600 text-sm mb-2">
            <b>Email:</b> {personal.email || employee.email} <b>Telefon:</b> {personal.phone || employee.phone}
          </div>
          <div className="text-gray-600 text-sm mb-2">
            <b>Data nașterii:</b> {formatDate(personal.dateOfBirth) || "-"} <b>Naționalitate:</b> {personal.nationality || "-"}
          </div>
          <div className="text-gray-600 text-sm mb-2">
            <b>Preferințe:</b>{" "}
            {[preferences.workType?.join(", "), preferences.availability, preferences.preferredLocations?.join(", "), preferences.industries?.join(", ")]
              .filter(Boolean)
              .join(" | ")}
          </div>
          <div className="text-gray-600 text-sm mb-2">
            <b>Salariu dorit:</b> {renderDesiredSalary()}
          </div>
          <div className="w-full mt-4">
            <h4 className="font-bold mb-2">Experiență profesională</h4>
            {(professional.experience || []).length === 0 && (
              <div className="text-gray-400 text-sm">Nicio experiență adăugată</div>
            )}
            {(professional.experience || []).map((exp, i) => (
              <div key={i} className="mb-2 border-b pb-2">
                <b>{exp.position}</b> la <b>{exp.company}</b>{" "}
                ({exp.startDate ? formatDate(exp.startDate) : ""} -{" "}
                {exp.current ? "Prezent" : exp.endDate ? formatDate(exp.endDate) : ""})
                <div className="text-xs text-gray-600">{exp.description}</div>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc pl-5 text-xs text-gray-500 mt-1">
                    {exp.achievements.map((achievement, j) => (
                      <li key={j}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div className="w-full mt-4">
            <h4 className="font-bold mb-2">Educație</h4>
            {(professional.education || []).length === 0 && (
              <div className="text-gray-400 text-sm">Nicio educație adăugată</div>
            )}
            {(professional.education || []).map((edu, i) => (
              <div key={i} className="mb-2 border-b pb-2">
                <b>{edu.degree}</b> la <b>{edu.institution}</b>{" "}
                ({edu.startDate ? formatDate(edu.startDate) : ""} -{" "}
                {edu.current ? "Prezent" : edu.endDate ? formatDate(edu.endDate) : ""})
                <div className="text-xs text-gray-600">{getEducationLabel(edu.field || "")}</div>
                {typeof edu.gpa === "number" && <div className="text-xs text-gray-500">GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
          <div className="w-full mt-4">
            <h4 className="font-bold mb-2">Certificări</h4>
            {certifications.length === 0 && (
              <div className="text-gray-400 text-sm">Nicio certificare adăugată</div>
            )}
            {certifications.map((cert, i) => (
              <div key={i} className="mb-2 border-b pb-2">
                <b>{cert.name}</b> de la <b>{cert.issuer}</b> ({formatDate(cert.date)})
                {cert.expiryDate && (
                  <span className="text-xs text-gray-500 ml-2">
                    Expiră: {formatDate(cert.expiryDate)}
                  </span>
                )}
                {cert.credentialId && <div className="text-xs text-gray-500">ID: {cert.credentialId}</div>}
              </div>
            ))}
          </div>
        </div>
        <hr className="my-6" />
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Lasă o recenzie pentru candidat
          </h3>
          <form className="space-y-4" onSubmit={handleReviewSubmit}>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Numele tău (opțional)
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Introdu numele"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Rating (1-5 stele)
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
                    className={`text-2xl ${
                      star <= form.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    aria-label={`Selectează ${star} stele`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Comentariu
              </label>
              <textarea
                value={form.text}
                onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                rows={4}
                placeholder="Scrie o recenzie pentru candidat..."
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Trimite recenzia
            </button>
          </form>
          {reviews.length > 0 && (
            <div className="flex flex-col gap-2 mt-4">
              {reviews.map((review, idx) => (
                <div key={idx} className="bg-green-50 rounded-xl p-3 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400" fill="#facc15" />
                    ))}
                    <span className="text-gray-700 font-semibold">
                      {review.name || "Anonim"}
                    </span>
                  </div>
                  <div className="text-gray-600">{review.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type EmployeeFilter = {
  location: string;
  skill: string;
  language: string;
  workType: string;
};

type EmployerUserResponse = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  hasCompletedCv?: boolean;
  isActive?: boolean;
  lastLogin?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  cv?: CvData;
};

type EmployeesApiResponse = {
  success: boolean;
  data: EmployerUserResponse[];
  error?: {
    message?: string;
  };
};

export default function EmployeeList() {
  const [filter, setFilter] = useState<EmployeeFilter>({
    location: "",
    skill: "",
    language: "",
    workType: "",
  });
  const [selected, setSelected] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTermsIdx, setShowTermsIdx] = useState<number | null>(null);
  const [showContactIdx, setShowContactIdx] = useState<number | null>(null);
  const contactHighlightTimeout = useRef<Record<number, number>>({});

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedAuthRaw = localStorage.getItem("auth-storage");
        const storedAuth = storedAuthRaw ? JSON.parse(storedAuthRaw) : {};
        const token: string | undefined = storedAuth?.state?.token;

        if (!token) {
          setError("Nu ești autentificat");
          setEmployees([]);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: EmployeesApiResponse = await response.json();
        if (data.success) {
          const mappedEmployees = data.data.map((user) => {
            const cv = user.cv || {};
            const personal = cv.personalInfo || {};
            const professional = cv.professional || {};
            const skills = cv.skills || {};
            const preferences = cv.preferences || {};

            const normalizedProfessional = {
              ...professional,
              experience: Array.isArray(professional.experience) ? professional.experience : [],
              education: Array.isArray(professional.education) ? professional.education : [],
            };

            const normalizedSkills = {
              technical: Array.isArray(skills.technical) ? skills.technical : [],
              soft: Array.isArray(skills.soft) ? skills.soft : [],
              languages: Array.isArray(skills.languages) ? skills.languages : [],
            };

            const normalizedCv: CvData = {
              personalInfo: personal,
              professional: normalizedProfessional,
              skills: normalizedSkills,
              preferences,
              certifications: Array.isArray(cv.certifications) ? cv.certifications : [],
              documents: cv.documents || {},
              additionalInfo: cv.additionalInfo,
            };

            return {
              _id: user._id,
              name: personal.name || user.name,
              email: personal.email || user.email,
              phone: personal.phone || user.phone,
              location: personal.location || user.location || "-",
              hasCompletedCv: user.hasCompletedCv,
              isActive: user.isActive,
              lastLogin: user.lastLogin,
              emailVerified: user.emailVerified,
              phoneVerified: user.phoneVerified,
              photoUrl:
                personal.profilePicture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(personal.name || user.name)}`,
              cv: normalizedCv,
            };
          });
          setEmployees(mappedEmployees);
        } else {
          setError(data.error?.message || "Eroare la încărcarea angajaților");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Eroare la încărcarea angajaților";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const cv = emp.cv || {};
      const technicalSkills = (cv.skills?.technical || []).join(", ").toLowerCase();
      const languageSkills = (cv.skills?.languages || [])
        .map((language) => language.language ?? "")
        .join(", ")
        .toLowerCase();
      const workType = (cv.preferences?.workType || []).join(", ").toLowerCase();

      const matchesLocation =
        !filter.location ||
        (emp.location || "").toLowerCase().includes(filter.location.toLowerCase());
      const matchesSkill =
        !filter.skill || technicalSkills.includes(filter.skill.toLowerCase());
      const matchesLanguage =
        !filter.language || languageSkills.includes(filter.language.toLowerCase());
      const matchesWorkType =
        !filter.workType || workType.includes(filter.workType.toLowerCase());

      return matchesLocation && matchesSkill && matchesLanguage && matchesWorkType;
    });
  }, [employees, filter]);

  return (
    <div className="max-w-5xl mx-auto mt-20 p-4 pb-10 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <User className="text-green-600" /> Angajați disponibili
      </h2>
      {loading ? (
        <div className="text-center text-gray-500">Se încarcă...</div>
      ) : error && error.includes('Acces restricționat') ? (
        <div className="text-center text-red-500">Acces restricționat. Activează un abonament pentru a folosi această funcție.</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div>
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              className="border rounded px-3 py-2 text-sm"
              placeholder="Filtru locație"
              value={filter.location}
              onChange={e => setFilter(f => ({ ...f, location: e.target.value }))}
            />
            <input
              className="border rounded px-3 py-2 text-sm"
              placeholder="Filtru skill"
              value={filter.skill}
              onChange={e => setFilter(f => ({ ...f, skill: e.target.value }))}
            />
            <input
              className="border rounded px-3 py-2 text-sm"
              placeholder="Filtru limbă"
              value={filter.language}
              onChange={e => setFilter(f => ({ ...f, language: e.target.value }))}
            />
            <select
              className="border rounded px-3 py-2 text-sm"
              value={filter.workType}
              onChange={e => setFilter(f => ({ ...f, workType: e.target.value }))}
            >
              <option value="">Tip job</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {filteredEmployees.map((emp, idx) => {
              const cv = emp.cv || {};
              const professional = cv.professional || {};
              const skills = cv.skills || {};
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-4 p-6 cursor-pointer hover:shadow-2xl transition"
                >
                  <img
                    src={emp.photoUrl}
                    alt={emp.name}
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-800">
                        {emp.name}
                      </span>
                      <BadgeCheck className="text-green-500" />
                    </div>
                    <div className="text-gray-500 text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {emp.location}
                    </div>
                    <div className="flex gap-2 mt-1 mb-2 flex-wrap">
                      {(skills.technical || []).map((s: string, i: number) => (
                        <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{s}</span>
                      ))}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {professional.summary || (professional.experience && professional.experience.length > 0 ? professional.experience[0].description : '')}
                    </div>
                    {/* Contactează + Terms & Conditions */}
                    <div className="flex flex-col gap-2 mt-4">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                          onClick={() => setSelected(emp)}
                        >
                          Detalii
                        </button>

                        {showContactIdx === idx && (
                          <div className="flex flex-wrap items-center gap-3 bg-blue-50 border border-blue-100 rounded-lg p-3 w-full">
                            {emp.email && (
                              <a
                                href={`mailto:${emp.email}`}
                                className="text-blue-600 hover:underline text-sm flex items-center gap-2 break-all"
                              >
                                <Mail className="w-4 h-4" />
                                <span>{emp.email}</span>
                              </a>
                            )}
                            {emp.phone && (
                              <a
                                href={`tel:${emp.phone}`}
                                className="text-green-600 hover:underline text-sm flex items-center gap-2"
                              >
                                <Phone className="w-4 h-4" />
                                <span>{emp.phone}</span>
                              </a>
                            )}
                          </div>
                        )}
                        {showContactIdx === idx ? (
                          <>
                            <button
                              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                              onClick={() => {
                                if (emp.email) {
                                  window.open(`mailto:${emp.email}`, "_blank");
                                } else if (emp.phone) {
                                  window.open(`tel:${emp.phone}`, "_blank");
                                }
                              }}
                            >
                              Contactează
                            </button>
                            <button
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
                              onClick={() => {
                                setShowContactIdx(null);
                              }}
                            >
                              Închide
                            </button>
                          </>
                        ) : (
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                            onClick={() => setShowTermsIdx(idx)}
                          >
                            Contactează
                          </button>
                        )}
                      </div>
                    </div>
                    <TermsModal
                      open={showTermsIdx === idx}
                      onAccept={() => {
                        setShowContactIdx(idx);
                        setShowTermsIdx(null);
                        contactHighlightTimeout.current[idx] = window.setTimeout(() => {
                          setShowContactIdx(null);
                        }, 10000);
                      }}
                      onClose={() => setShowTermsIdx(null)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Folosirea datelor de contact ale candidatului este permisă doar
            în scop profesional și cu respectarea legislației în vigoare.
            Orice formă de hărțuire sau utilizare neautorizată a datelor va fi
            sancționată. Prin accesarea acestor informații, te angajezi să
            respectezi confidențialitatea și să folosești datele doar pentru
            explicit al candidatului.
          </p>
        </div>
      )}
      <EmployeeModal
        employee={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
