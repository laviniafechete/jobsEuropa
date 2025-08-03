import React from 'react';

export default function CookiesPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Politica de Cookies și Stocare Locală</h1>
      <p className="mb-4"><strong>Ultima actualizare: 29.07.2025</strong></p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Ce sunt cookies-urile și stocarea locală?</h2>
      <p className="mb-4">
        Cookies-urile sunt fișiere mici stocate pe dispozitivul tău de către browserul web atunci când vizitezi site-ul nostru. 
        LocalStorage și SessionStorage sunt tehnologii similare care permit stocarea datelor în browserul tău pentru a îmbunătăți experiența ta pe site.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Ce informații stocăm și pentru ce?</h2>
      
      <h3 className="text-lg font-medium mt-4 mb-2">🔐 Date de autentificare (Necesare)</h3>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>auth-store:</strong> Token-ul de autentificare, informații despre tipul de utilizator (candidat/angajator)</li>
        <li><strong>admin-store:</strong> Token-ul de autentificare pentru administratori</li>
        <li><strong>token:</strong> Token JWT pentru sesiunea curentă</li>
        <li><strong>Scop:</strong> Să te menținem logat între vizite și să îți oferim acces la contul tău</li>
      </ul>

      <h3 className="text-lg font-medium mt-4 mb-2">👤 Informații profil utilizator (Necesare)</h3>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>userId, userName, userPhone:</strong> Identificarea și datele de bază ale utilizatorului</li>
        <li><strong>employerId, employerEmailOrPhone:</strong> Identificarea și datele de bază ale angajatorului</li>
        <li><strong>hasCompletedCv:</strong> Status completare CV pentru candidați</li>
        <li><strong>cv:</strong> Datele CV-ului salvat local pentru editare rapidă</li>
        <li><strong>company, jobAds:</strong> Informații despre companie și joburile postate (pentru angajatori)</li>
        <li><strong>Scop:</strong> Să îți afișăm profilul corect și să salvăm progresul în completarea formularelor</li>
      </ul>

      <h3 className="text-lg font-medium mt-4 mb-2">🍪 Preferințe utilizator (Opționale)</h3>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>cookieConsent:</strong> Preferința ta privind acceptarea cookies-urilor</li>
        <li><strong>Scop:</strong> Să nu îți mai afișăm banner-ul de cookies după ce ai făcut o alegere</li>
      </ul>

      <h3 className="text-lg font-medium mt-4 mb-2">Date temporare interfață (Necesare)</h3>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>snackbar-store:</strong> Mesajele de notificare afișate temporar</li>
        <li><strong>Scop:</strong> Să îți afișăm mesaje de confirmare, erori sau avertismente</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Nu folosim cookies de urmărire</h2>
      <p className="mb-4">
        <strong>Jobs Europa NU folosește:</strong>
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Google Analytics sau alte servicii de urmărire</li>
        <li>Facebook Pixel sau alte cookies de marketing</li>
        <li>Cookies de publicitate terță parte</li>
        <li>Cookies pentru profilare sau urmărire cross-site</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Cât timp păstrăm datele?</h2>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Date de autentificare:</strong> Până la delogare sau expirarea sesiunii</li>
        <li><strong>Informații profil:</strong> Până la ștergerea contului sau curățarea manuală</li>
        <li><strong>Preferințe cookies:</strong> Până la curățarea cache-ului browserului</li>
        <li><strong>Date temporare:</strong> Se șterg automat la închiderea browserului</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Cum poți controla stocarea?</h2>
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h4 className="font-semibold mb-2">🧹 Curățare automată:</h4>
        <p className="mb-2">
          Când vizitezi pagina principală ("/"), toate datele stocate local și cookies-urile sunt șterse automat pentru a-ți proteja intimitatea.
        </p>
      </div>
      
      <h4 className="font-semibold mb-2">Manual în browser:</h4>
      <ul className="list-disc ml-6 mb-4">
        <li>Chrome: Settings → Privacy and security → Clear browsing data</li>
        <li>Firefox: Settings → Privacy & Security → Clear Data</li>
        <li>Safari: Preferences → Privacy → Manage Website Data</li>
        <li>Edge: Settings → Privacy, search, and services → Clear browsing data</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Cookies necesare vs opționale</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-red-800">❗ Necesare (nu pot fi dezactivate)</h4>
          <ul className="text-sm text-red-700">
            <li>• Autentificare și sesiune</li>
            <li>• Informații profil utilizator</li>
            <li>• Funcționalitate de bază site</li>
          </ul>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-green-800">Opționale (le poți refuza)</h4>
          <ul className="text-sm text-green-700">
            <li>• Preferințe cookies</li>
            <li>• Îmbunătățiri experiență utilizator</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Consimțământ și opțiuni</h2>
      <p className="mb-4">
        La prima vizită pe site, vei vedea un banner de consimțământ pentru cookies opționale. 
        Cookies-urile necesare pentru funcționarea site-ului sunt activate automat, în conformitate cu interesul legitim.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Securitatea datelor</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Toate datele sensibile sunt criptate înainte de stocare</li>
        <li>Token-urile de autentificare expiră automat pentru securitate</li>
        <li>Nu stocăm parole în localStorage sau cookies</li>
        <li>Conexiunea la site este securizată prin HTTPS</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact și întrebări</h2>
      <p className="mb-4">
        Pentru întrebări despre această politică de cookies sau despre cum îți gestionăm datele, ne poți contacta la:{" "}
        <a href="mailto:contact@jobs-europa.com" className="text-blue-600 underline">
          contact@jobs-europa.com
        </a>
      </p>

      <div className="bg-gray-100 p-4 rounded-lg mt-6">
        <p className="text-sm text-gray-600">
          <strong>Notă:</strong> Această politică poate fi actualizată periodic. 
          Te vom informa despre modificări importante prin afișarea datei ultimei actualizări în partea de sus a acestei pagini.
        </p>
      </div>
    </div>
  );
} 