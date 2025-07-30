import React from 'react';

export default function NewsletterPolicy() {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-6">Politica de Newsletter</h1>
      <p className="mb-4">Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Consimțământ</h2>
      <p className="mb-4">Trimitem newslettere și comunicări comerciale doar utilizatorilor care și-au dat consimțământul explicit.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. Ce conține newsletterul?</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Informații despre joburi noi și oportunități relevante</li>
        <li>Noutăți despre platformă și funcționalități</li>
        <li>Oferte speciale pentru angajatori sau candidați</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. Dezabonare</h2>
      <p className="mb-4">Te poți dezabona oricând folosind linkul din fiecare email sau scriindu-ne la <a href="mailto:contact@jobs-europa.com" className="text-blue-600 underline">contact@jobs-europa.com</a>.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. Protecția datelor</h2>
      <p className="mb-4">Datele tale nu vor fi partajate cu terți pentru marketing fără acordul tău. Respectăm GDPR și dreptul la confidențialitate.</p>
    </div>
  );
} 