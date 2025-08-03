import React, { useState } from "react";

type Option = { value: string; label: string };
type Props = {
  value: string;
  options: Option[];
  onChange: (val: string) => void;
  label?: string;
  className?: string;
  name?: string;
};

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= 640;
}

export default function CustomSelect({
  value,
  options,
  onChange,
  label,
  className = "",
  name,
}: Props) {
  const [open, setOpen] = useState(false);

  // Mobile: custom dropdown
  if (typeof window !== "undefined" && isMobile()) {
    const selected = options.find((o) => o.value === value);
    return (
      <div className={`relative w-full ${className}`}>
        {label && (
          <label className="block text-gray-700 font-medium mb-1">
            {label}
          </label>
        )}
        <button
          type="button"
          className="w-full border rounded-lg px-4 py-3 bg-white text-left text-base flex items-center justify-between"
          onClick={() => setOpen((v) => !v)}
        >
          <span>{selected ? selected.label : "Alege..."}</span>
          <svg
            className="w-5 h-5 ml-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {open && (
          <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-20 max-h-60 overflow-auto border">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`w-full text-left px-4 py-3 text-base hover:bg-blue-50 ${
                  value === opt.value ? "bg-blue-100 font-semibold" : ""
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
        {open && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden
          />
        )}
      </div>
    );
  }

  // Desktop: native select
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-gray-700 font-medium mb-1">{label}</label>
      )}
      <select
        className="border rounded-lg px-3 py-2 w-full text-base"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        name={name}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
