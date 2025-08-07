import React from 'react';

// Listă completă de prefixuri internaționale (cele mai folosite, poți extinde după nevoie)
const COUNTRY_PREFIXES = [
  { code: '+213', country: 'Algeria' },
  { code: '+61', country: 'Australia' },
  { code: '+43', country: 'Austria' },
  { code: '+994', country: 'Azerbaidjan' },
  { code: '+32', country: 'Belgia' },
  { code: '+387', country: 'Bosnia' },
  { code: '+1', country: 'SUA/Canada' },
  { code: '+86', country: 'China' },
  { code: '+385', country: 'Croația' },
  { code: '+420', country: 'Cehia' },
  { code: '+45', country: 'Danemarca' },
  { code: '+20', country: 'Egipt' },
  { code: '+358', country: 'Finlanda' },
  { code: '+33', country: 'Franța' },
  { code: '+995', country: 'Georgia' },
  { code: '+49', country: 'Germania' },
  { code: '+30', country: 'Grecia' },
  { code: '+353', country: 'Irlanda' },
  { code: '+972', country: 'Israel' },
  { code: '+39', country: 'Italia' },
  { code: '+81', country: 'Japonia' },
  { code: '+389', country: 'Macedonia' },
  { code: '+212', country: 'Maroc' },
  { code: '+373', country: 'Moldova' },
  { code: '+382', country: 'Muntenegru' },
  { code: '+64', country: 'Noua Zeelandă' },
  { code: '+31', country: 'Olanda' },
  { code: '+47', country: 'Norvegia' },
  { code: '+48', country: 'Polonia' },
  { code: '+351', country: 'Portugalia' },
  { code: '+40', country: 'România' },
  { code: '+7', country: 'Rusia/Kazakhstan' },
  { code: '+381', country: 'Serbia' },
  { code: '+421', country: 'Slovacia' },
  { code: '+386', country: 'Slovenia' },
  { code: '+27', country: 'Africa de Sud' },
  { code: '+34', country: 'Spania' },
  { code: '+46', country: 'Suedia' },
  { code: '+41', country: 'Elveția' },
  { code: '+216', country: 'Tunisia' },
  { code: '+90', country: 'Turcia' },
  { code: '+380', country: 'Ucraina' },
  { code: '+36', country: 'Ungaria' },
  { code: '+44', country: 'Marea Britanie' },
  { code: '+91', country: 'India' },
  { code: '+82', country: 'Coreea de Sud' },
  // ... poți adăuga toate prefixurile ITU dacă vrei lista completă
];

interface PhoneInputProps {
  value: { prefix: string; number: string };
  onChange: (val: { prefix: string; number: string }) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, label, required, disabled }) => {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="flex w-full">
        <select
          className="w-36 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          value={value.prefix}
          onChange={e => onChange({ ...value, prefix: e.target.value })}
          disabled={disabled}
          required={required}
        >
          {COUNTRY_PREFIXES.map((c) => (
            <option key={c.code} value={c.code} title={`${c.code} (${c.country})`}>
              {c.code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          className="w-full px-3 py-2 border-t border-b border-r border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="Număr de telefon"
          value={value.number}
          onChange={e => onChange({ ...value, number: e.target.value.replace(/[^0-9]/g, '') })}
          required={required}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default PhoneInput; 