import React from "react";
import { Briefcase, MapPin, Edit, Star } from "lucide-react";
import type { JobAd } from "../../context/EmployerContext";

export default function JobAdCard({
  ad,
  onEdit,
  onPromote,
}: {
  ad: JobAd;
  onEdit: () => void;
  onPromote?: () => void;
}) {
  function formatSalary(salary: any) {
    if (!salary) return 'Salariu negociabil';
    if (typeof salary === 'string') return salary;
    if (typeof salary === 'object') {
      const { min, max, currency } = salary;
      if (min && max) return `${min} - ${max} ${currency || 'RON'}`;
      if (min) return `${min}+ ${currency || 'RON'}`;
      if (max) return `Până la ${max} ${currency || 'RON'}`;
      return 'Salariu negociabil';
    }
    return 'Salariu negociabil';
  }

  return (
    <div className="bg-green-50 border border-green-100 rounded-xl shadow flex flex-col md:flex-row gap-4 p-4 items-center">
      {ad.image ? (
        <img
          src={ad.image}
          alt={ad.title}
          className="w-28 h-28 object-cover rounded-lg border"
        />
      ) : (
        <div className="w-28 h-28 flex items-center justify-center bg-green-100 rounded-lg">
          <Briefcase className="w-10 h-10 text-green-400" />
        </div>
      )}
      <div className="flex-1 w-full">
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="text-green-600" />
          <span className="font-bold text-lg text-gray-800">{ad.title}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
          <MapPin className="w-4 h-4" /> {ad.location}
        </div>
        <div className="flex gap-2 mb-1 flex-wrap">
          <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">
            {ad.domain || ad.category}
          </span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
            {ad.type}
          </span>
          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
            {formatSalary(ad.salary)}
          </span>
          {ad.experience && (
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
              {ad.experience}
            </span>
          )}
        </div>
        <div className="text-gray-700 text-sm mb-2">{ad.requirements || ad.description}</div>
        {ad.skills && ad.skills.length > 0 && (
          <div className="mb-1 text-xs text-gray-600">
            <b>Skills:</b> {ad.skills.join(", ")}
          </div>
        )}
        {ad.benefits && ad.benefits.length > 0 && (
          <div className="mb-1 text-xs text-gray-600">
            <b>Beneficii:</b> {ad.benefits.join(", ")}
          </div>
        )}
        <div className="flex gap-2">
          <button
            className="inline-flex items-center gap-1 text-green-700 hover:text-green-900 text-sm font-semibold"
            onClick={onEdit}
          >
            <Edit className="w-4 h-4" /> Editează
          </button>
          {onPromote && (
            <button
              className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-900 text-sm font-semibold"
              onClick={onPromote}
            >
              <Star className="w-4 h-4" /> Promovează
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
