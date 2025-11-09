import React, { useEffect, useState } from "react";
import { MapPin, MessageCircle, ArrowRight, Mail, Phone, Send, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "../config/env";
import { useAuthStore } from "../stores/authStore";
import { useSnackbar } from "../hooks/useSnackbar";

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  category: string;
  salary: {
    min?: number;
    max?: number;
    currency: string;
  };
  employer: {
    companyName: string;
    email?: string;
    phone?: string;
    emailOrPhone?: string;
    companyProfile?: {
      logo?: string;
      name?: string;
      industry?: string;
      description?: string;
      website?: string;
      phone?: string;
      email?: string;
      address?: string;
      benefits?: string[];
    };
  };
  hasApplied?: boolean;
  benefits?: string[];
  skills?: string[];
  views: number;
  createdAt: string;
}

interface JobCardProps {
  job: Job;
  onClick?: (job: Job) => void;
  onApplied?: (jobId: string) => void;
}

export default function JobCard({ job, onClick, onApplied }: JobCardProps) {
  const { userType, token } = useAuthStore();
  const { showError, showSuccess } = useSnackbar();
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestApplication, setGuestApplication] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [hasApplied, setHasApplied] = useState(Boolean(job.hasApplied));

  useEffect(() => {
    setHasApplied(Boolean(job.hasApplied));
  }, [job.hasApplied]);

  const formatSalary = (salary: Job["salary"] | string | null | undefined): string => {
    if (!salary) return "Salariu negociabil";
    if (typeof salary === "string") return salary;
    if (typeof salary === "object") {
      const min = salary.min ?? "";
      const max = salary.max ?? "";
      const currency = salary.currency || "RON";
      if (min && max) return `${min} - ${max} ${currency}/lună`;
      if (min) return `${min}+ ${currency}/lună`;
      if (max) return `Până la ${max} ${currency}/lună`;
      return "Salariu negociabil";
    }
    return "Salariu negociabil";
  };

  const companyEmail = job.employer?.companyProfile?.email || job.employer?.email || "";
  const companyPhone = job.employer?.companyProfile?.phone || job.employer?.phone || "";

  const handleContactClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowContactInfo((prev) => !prev);
    setShowApplyForm(false);
  };

  const handleApplyClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (hasApplied) {
      return;
    }
    if (userType === "user" && token) {
      await handleLoggedApplication();
      return;
    }
    setShowApplyForm((prev) => !prev);
    setShowContactInfo(false);
  };

  const handleLoggedApplication = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${job._id}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || data.message || "Eroare la aplicare");
      }

      setHasApplied(true);
      setShowApplyForm(false);
      onApplied?.(job._id);
      showSuccess("Aplicarea a fost trimisă cu succes!");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Eroare la trimiterea aplicării. Încearcă din nou.";
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSubmit = async (event: React.FormEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (!guestApplication.name.trim() || !guestApplication.phone.trim()) {
      showError("Completează numele și numărul de telefon.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${job._id}/guest-apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guestApplication),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || data.message || "Eroare la trimiterea cererii.");
      }

      showSuccess("Datele tale au fost trimise angajatorului!");
      setGuestApplication({ name: "", phone: "", email: "", message: "" });
      setShowApplyForm(false);
      setHasApplied(true);
      onApplied?.(job._id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Eroare la trimiterea cererii. Încearcă din nou.";
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={() => onClick?.(job)}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-blue-600 font-medium">
            {job.employer?.companyName || "Companie necunoscută"}
          </p>
        </div>
      </div>

      <div className="flex items-center text-gray-600 mb-3">
        <MapPin className="mr-1" size={16} />
        <span className="text-sm">{job.location}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {job.type === "full-time"
            ? "Full-time"
            : job.type === "part-time"
            ? "Part-time"
            : job.type === "contract"
            ? "Contract"
            : "Internship"}
        </span>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          {job.category}
        </span>
        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
          {formatSalary(job.salary)}
        </span>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{job.description}</p>

      <div className="flex items-center justify-between gap-2 mt-4">
        <div className="text-xs text-gray-500">{job.views} vizualizări</div>

        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          style={{ minWidth: 150 }}
          onClick={handleContactClick}
        >
          <MessageCircle size={16} />
          Contactează
          <ArrowRight size={16} />
        </button>
        {!hasApplied ? (
          <button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors justify-center disabled:bg-green-400"
            style={{ minWidth: 180 }}
            onClick={handleApplyClick}
            disabled={isSubmitting}
          >
            <Send size={16} />
            {isSubmitting ? "Se trimite..." : "Aplică"}
          </button>
        ) : (
          <span className="text-sm font-semibold text-green-700 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            Ai aplicat la acest job
          </span>
        )}
      </div>

      {showContactInfo && (
        <div
          className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <h4 className="text-sm font-semibold text-blue-900">Date de contact companie</h4>
          {companyEmail && (
            <a
              href={`mailto:${companyEmail}`}
              className="flex items-center gap-2 text-blue-700 hover:underline text-sm break-all"
            >
              <Mail size={16} />
              <span>{companyEmail}</span>
            </a>
          )}
          {companyPhone && (
            <a
              href={`tel:${companyPhone}`}
              className="flex items-center gap-2 text-green-700 hover:underline text-sm"
            >
              <Phone size={16} />
              <span>{companyPhone}</span>
            </a>
          )}
          {!companyEmail && !companyPhone && (
            <p className="text-sm text-blue-700">
              Momentan nu există date de contact publice. Încearcă să aplici la job pentru a
              transmite datele tale.
            </p>
          )}
        </div>
      )}

      {showApplyForm && (
        <form
          className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col gap-3"
          onSubmit={handleGuestSubmit}
          onClick={(e) => e.stopPropagation()}
        >
          <h4 className="text-sm font-semibold text-green-900">Aplică rapid fără cont</h4>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-700">Nume complet *</label>
            <input
              type="text"
              className="border rounded-lg px-3 py-2 text-sm"
              required
              value={guestApplication.name}
              onChange={(e) =>
                setGuestApplication((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-700">Telefon *</label>
            <input
              type="tel"
              className="border rounded-lg px-3 py-2 text-sm"
              required
              value={guestApplication.phone}
              onChange={(e) =>
                setGuestApplication((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-700">Email (opțional)</label>
            <input
              type="email"
              className="border rounded-lg px-3 py-2 text-sm"
              value={guestApplication.email}
              onChange={(e) =>
                setGuestApplication((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-700">Mesaj (opțional)</label>
            <textarea
              className="border rounded-lg px-3 py-2 text-sm"
              rows={3}
              value={guestApplication.message}
              onChange={(e) =>
                setGuestApplication((prev) => ({
                  ...prev,
                  message: e.target.value,
                }))
              }
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            <Send size={16} />
            {isSubmitting ? "Se trimite..." : "Trimite datele"}
          </button>
        </form>
      )}
    </div>
  );
}
