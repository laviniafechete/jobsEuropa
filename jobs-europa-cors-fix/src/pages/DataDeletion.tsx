import React from 'react';

export default function DataDeletion() {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-6">Ștergerea Datelor Personale</h1>
      <p className="mb-6">
        Poți solicita ștergerea completă a datelor tale personale de pe Jobs Europa, indiferent dacă ești utilizator candidat sau angajator.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Ce informații sunt șterse?</h2>
      
      <h3 className="text-lg font-semibold mt-4 mb-2">Pentru candidați:</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Contul de utilizator și datele de autentificare</li>
        <li>Informațiile din CV (experiență, educație, competențe)</li>
        <li>Datele de contact (email, telefon, adresă)</li>
        <li>Specificați tipul de cont (candidat sau angajator/companie)</li>
        <li>Istoricul aplicărilor la joburi</li>
        <li>Recenziile primite și date</li>
        <li>Preferințele și setările contului</li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">Pentru angajatori:</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Contul companiei și datele de autentificare</li>
        <li><strong>Pentru angajatori:</strong> Contul companiei, profilul companiei, anunțurile de joburi postate, candidaturile primite, abonamentele, istoricul plăților, datele de contact</li>
      </ul>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">Important de știut</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Ștergerea este definitivă și ireversibilă</li>
        <li>Datele nu vor mai putea fi recuperate după procesare</li>
        <li>Procesarea solicitării poate dura până la 30 de zile conform GDPR</li>
        <li>Anumite date pot fi păstrate pentru obligații legale (facturi, contracte) conform legislației în vigoare</li>
      </ul>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p className="mb-4">Pentru orice întrebări suplimentare despre ștergerea datelor sau drepturile tale GDPR, scrie-ne la <a href="mailto:contact@jobs-europa.com" className="text-blue-600 underline">contact@jobs-europa.com</a>.</p>
    </div>
  );
} 