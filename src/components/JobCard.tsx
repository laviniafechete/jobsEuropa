import React, { useState } from 'react';
import { MapPin, MessageCircle, ArrowRight, Phone, Mail, CheckCircle } from 'lucide-react';

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
  token?: string;
  onApply?: (job: Job) => void;
  onShowDetails?: (job: Job) => void;
  applying?: boolean;
}

export default function JobCard({ job, token, onApply, onShowDetails, applying = false }: JobCardProps) {
  const [showContactOptions, setShowContactOptions] = useState(false);

  const handlePhoneContact = (job: Job) => {
    // Only use company's phone number
    const phoneNumber = job.employer?.companyProfile?.phone || job.employer?.emailOrPhone;
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleWhatsAppContact = (job: Job) => {
    // Only use company's phone number
    const phoneNumber = job.employer?.companyProfile?.phone || job.employer?.emailOrPhone;
    if (phoneNumber) {
      const message = encodeURIComponent(`Bună ziua! Sunt interesat/ă de postul "${job.title}" din anunțul dumneavoastră.`);
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
  };

  const handleEmailContact = (job: Job) => {
    // Only use company's email
    const email = job.employer?.companyProfile?.email || job.employer?.emailOrPhone;
    if (email) {
      const subject = encodeURIComponent(`Aplicare pentru ${job.title}`);
      const body = encodeURIComponent(`Bună ziua,

Sunt interesat/ă de postul "${job.title}" din anunțul dumneavoastră.

Vă rog să mă contactați pentru mai multe detalii.

Cu stimă`);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
  };

  const toggleContactOptions = (jobId: string) => {
    setShowContactOptions(!showContactOptions);
  };

  const formatSalary = (salary: any) => {
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

  return (
    <div
      onClick={() => onShowDetails?.(job)}
      className={`bg-white rounded-lg shadow-md p-6 border transition-all cursor-pointer ${
        job.hasApplied 
          ? 'border-green-200 bg-green-50' 
          : 'border-gray-200 hover:shadow-lg'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {job.title}
          </h3>
          <p className="text-blue-600 font-medium">
            {job.employer?.companyName || "Companie necunoscută"}
          </p>
        </div>
        {job.hasApplied && (
          <CheckCircle className="text-green-500 flex-shrink-0 ml-2" size={20} />
        )}
      </div>
      
      <div className="flex items-center text-gray-600 mb-3">
        <MapPin className="mr-1" size={16} />
        <span className="text-sm">{job.location}</span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {job.type === 'full-time' ? 'Full-time' : 
           job.type === 'part-time' ? 'Part-time' :
           job.type === 'contract' ? 'Contract' : 'Internship'}
        </span>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          {job.category}
        </span>
        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
          {formatSalary(job.salary)}
        </span>
      </div>
      
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {job.description}
      </p>
      
      <div className="flex items-center justify-between gap-2 mt-4">
        <div className="text-xs text-gray-500">
          {job.views} vizualizări
        </div>
        
        {job.hasApplied ? (
          <button
            disabled
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg opacity-80 cursor-not-allowed"
            style={{ minWidth: 180 }}
          >
            <CheckCircle className="mr-1" size={16} />
            Ai aplicat cu succes
          </button>
        ) : !token ? (
          /* Guest user - show contact options */
          <div className="relative contact-options-container">
            <button
              onClick={(e) => { e.stopPropagation(); toggleContactOptions(job._id); }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              style={{ minWidth: 180 }}
            >
              <MessageCircle size={16} />
              Contactează
              <ArrowRight size={16} className={`transform transition-transform ${showContactOptions ? 'rotate-90' : ''}`} />
            </button>
            
            {showContactOptions && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2 space-y-1">
                  {job.employer?.companyProfile?.phone && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePhoneContact(job); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors text-left"
                    >
                      <Phone size={16} className="text-green-600" />
                      <span className="text-sm">Sună {job.employer.companyName}</span>
                    </button>
                  )}
                  
                  {(job.employer?.companyProfile?.phone || job.employer?.emailOrPhone) && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleWhatsAppContact(job); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors text-left"
                    >
                      <MessageCircle size={16} className="text-green-500" />
                      <span className="text-sm">WhatsApp {job.employer.companyName}</span>
                    </button>
                  )}
                  
                  {(job.employer?.companyProfile?.email || job.employer?.emailOrPhone) && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEmailContact(job); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors text-left"
                    >
                      <Mail size={16} className="text-blue-600" />
                      <span className="text-sm">Email {job.employer.companyName}</span>
                    </button>
                  )}
                  
                  {!job.employer?.companyProfile?.phone && !job.employer?.companyProfile?.email && !job.employer?.emailOrPhone && (
                    <div className="px-3 py-2 text-xs text-gray-500 text-center">
                      Nu sunt disponibile informații de contact
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Authenticated user - normal apply button */
          <button
            onClick={(e) => { e.stopPropagation(); onApply?.(job); }}
            disabled={applying}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            style={{ minWidth: 180 }}
          >
            {applying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Se procesează...
              </>
            ) : (
              <>
                Aplică acum
                <ArrowRight size={16} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
} 