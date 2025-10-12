import React from 'react';
import { MapPin, MessageCircle, ArrowRight } from 'lucide-react';

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
  onClick?: (job: Job) => void;
}

export default function JobCard({ job, onClick }: JobCardProps) {
  const formatSalary = (salary: Job['salary'] | string | null | undefined): string => {
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
      onClick={() => onClick?.(job)}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
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
        
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          style={{ minWidth: 180 }}
        >
          <MessageCircle size={16} />
          Contactează
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
} 