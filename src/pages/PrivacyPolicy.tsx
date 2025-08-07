import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow mt-10 mb-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Politica de Confidențialitate</h1>
      <p className="mb-6 text-gray-600">
        <strong>Ultima actualizare:</strong> {new Date().toLocaleDateString('ro-RO')} |{' '}
        <strong>Intrare în vigoare:</strong> {new Date().toLocaleDateString('ro-RO')}
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
        <p className="text-blue-800">
          <strong>Jobs Europa</strong> este o platformă dedicată conectării candidaților cu angajatorii în domenii precum construcții, menaj, curățenie, îngrijire, transport și multe altele. Această politică explică în detaliu cum colectăm, procesăm, stocăm și protejăm datele dumneavoastră personale.
        </p>
      </div>

      <div className="space-y-8">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Identitatea și Datele de Contact ale Operatorului</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-2"><strong>Operator de date personale:</strong> Jobs Europa</p>
            <p className="mb-2"><strong>Email contact:</strong> <a href="mailto:contact@jobs-europa.com" className="text-blue-600 underline">contact@jobs-europa.com</a></p>
            <p className="mb-2"><strong>Telefon:</strong> <a href="tel:+40757758647" className="text-blue-600 underline">+40 757 758 647</a></p>
            <p className="mb-2"><strong>Adresă web:</strong> jobs-europa.com</p>
            <p><strong>Responsabil protecția datelor (DPO):</strong> Pentru orice întrebări legate de protecția datelor, contactați-ne la email-ul de mai sus.</p>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Categorii de Date Personale Colectate</h2>
          
          <h3 className="text-lg font-medium mb-3 text-blue-700">2.1 Pentru Candidați:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li><strong>Date de identificare:</strong> nume, prenume, data nașterii, gen</li>
            <li><strong>Date de contact:</strong> adresă email, număr de telefon (cu prefix internațional), locația geografică</li>
            <li><strong>Date profesionale:</strong> experiență profesională, educație, competențe tehnice, limbi străine cu nivelul de cunoaștere</li>
            <li><strong>Domenii de interes:</strong> maximum 3 domenii selectate din 20 disponibile</li>
            <li><strong>Preferințe profesionale:</strong> disponibilitate, așteptări salariale, disponibilitate relocare</li>
            <li><strong>Documente:</strong> permis de conducere, pașaport/carte de identitate (doar confirmarea existenței)</li>
            <li><strong>Date de autentificare:</strong> parolă criptată, token-uri de sesiune, date OAuth (Google)</li>
            <li><strong>Istoricul aplicărilor:</strong> joburile la care ați aplicat, data aplicării, statusul aplicării</li>
          </ul>

          <h3 className="text-lg font-medium mb-3 text-blue-700">2.2 Pentru Angajatori:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li><strong>Date personale:</strong> nume, prenume, funcția în companie</li>
            <li><strong>Date de contact:</strong> email profesional, telefon</li>
            <li><strong>Date companie:</strong> denumirea companiei, locația, descrierea activității, numărul de angajați</li>
            <li><strong>Date abonament:</strong> tipul abonamentului (trial, basic, premium), data expirării, istoric plăți</li>
            <li><strong>Date de plată:</strong> procesate și stocate de Stripe (nu sunt stocate local)</li>
            <li><strong>Postări de job-uri:</strong> anunțurile publicate, candidații vizualizați</li>
          </ul>

          <h3 className="text-lg font-medium mb-3 text-blue-700">2.3 Date Tehnice (pentru toți utilizatorii):</h3>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li><strong>Date de navigare:</strong> adresa IP, browser, sistem de operare, rezoluția ecranului</li>
            <li><strong>Cookies și local storage:</strong> preferințe utilizator, token-uri de autentificare, setări interfață</li>
            <li><strong>Date de utilizare:</strong> paginile vizitate, timpul petrecut, acțiunile efectuate</li>
            <li><strong>Date de securitate:</strong> încercări de login, adrese IP suspecte, activități neobișnuite</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Bazele Legale și Scopurile Prelucrării</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Scopul prelucrării</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Baza legală</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Perioada de stocare</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Crearea și administrarea contului</td>
                  <td className="border border-gray-300 px-4 py-2">Executarea contractului (Art. 6(1)(b) GDPR)</td>
                  <td className="border border-gray-300 px-4 py-2">Durata contului + 1 an</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Facilitarea aplicărilor la joburi</td>
                  <td className="border border-gray-300 px-4 py-2">Executarea contractului</td>
                  <td className="border border-gray-300 px-4 py-2">Durata contului + 2 ani</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Marketing și comunicare</td>
                  <td className="border border-gray-300 px-4 py-2">Consimțământul (Art. 6(1)(a) GDPR)</td>
                  <td className="border border-gray-300 px-4 py-2">Până la retragerea consimțământului</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Procesarea plăților (angajatori)</td>
                  <td className="border border-gray-300 px-4 py-2">Executarea contractului</td>
                  <td className="border border-gray-300 px-4 py-2">7 ani (obligații fiscale)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Securitatea platformei</td>
                  <td className="border border-gray-300 px-4 py-2">Interesul legitim (Art. 6(1)(f) GDPR)</td>
                  <td className="border border-gray-300 px-4 py-2">12 luni</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Îndeplinirea obligațiilor legale</td>
                  <td className="border border-gray-300 px-4 py-2">Obligația legală (Art. 6(1)(c) GDPR)</td>
                  <td className="border border-gray-300 px-4 py-2">Conform legislației aplicabile</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Destinatarii Datelor Personale</h2>
          
          <h3 className="text-lg font-medium mb-3 text-blue-700">4.1 Parteneri și Procesatori:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li><strong>Stripe Inc.</strong> - procesarea plăților pentru abonamente angajatori (Irlanda, SUA - cu acorduri de transfer adecvate)</li>
            <li><strong>Google LLC</strong> - autentificare OAuth și servicii de hosting (SUA - cu acorduri de transfer adecvate)</li>

            <li><strong>Furnizori servicii email</strong> - pentru trimiterea notificărilor și comunicărilor</li>
            <li><strong>Furnizori servicii SMS</strong> - pentru verificarea numerelor de telefon și notificări</li>
            <li><strong>Servicii de hosting și cloud</strong> - pentru stocarea și procesarea datelor</li>
          </ul>

          <h3 className="text-lg font-medium mb-3 text-blue-700">4.2 Împărtășirea cu Terțe Părți:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            <li><strong>Angajatori înregistrați:</strong> datele din CV-ul candidaților (doar la aplicarea la joburi)</li>
            <li><strong>Autorități competente:</strong> în cazul investigațiilor legale sau obligațiilor de raportare</li>
            <li><strong>Succesorii în afaceri:</strong> în cazul fuziunii, achiziției sau restructurării companiei</li>
          </ul>

          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-800">
              <strong>Nu vindem niciodată datele personale către terțe părți în scopuri comerciale.</strong>
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Drepturile Dumneavoastră conform GDPR</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">📋 Dreptul de Acces (Art. 15)</h4>
                <p className="text-sm">Puteți solicita o copie a tuturor datelor personale pe care le procesăm despre dumneavoastră.</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">✏️ Dreptul de Rectificare (Art. 16)</h4>
                <p className="text-sm">Puteți corecta datele inexacte sau incomplete din contul dumneavoastră.</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-semibold text-red-700 mb-2">🗑️ Dreptul la Ștergere (Art. 17)</h4>
                <p className="text-sm">Puteți cere ștergerea datelor în anumite condiții ("dreptul de a fi uitat").</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-700 mb-2">📦 Dreptul la Portabilitate (Art. 20)</h4>
                <p className="text-sm">Puteți primi datele într-un format structurat pentru transfer la alt operator.</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-2">⛔ Dreptul la Restricționare (Art. 18)</h4>
                <p className="text-sm">Puteți limita procesarea datelor în anumite circumstanțe.</p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">🚫 Dreptul la Opoziție (Art. 21)</h4>
                <p className="text-sm">Puteți vă opune procesării bazate pe interesul legitim.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-yellow-800">
              <strong>Cum exercitați aceste drepturi:</strong> Trimiteți un email la{' '}
              <a href="mailto:contact@jobs-europa.com" className="underline font-semibold">contact@jobs-europa.com</a>{' '}
              cu subiectul "Solicitare GDPR" și specificați dreptul pe care doriți să-l exercitați. 
              Vom răspunde în termen de 30 de zile.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Măsuri de Securitate</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3 text-blue-700">Măsuri Tehnice:</h3>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Criptarea datelor în transit (HTTPS/TLS)</li>
                <li>Criptarea parolelor (bcrypt)</li>
                <li>Token-uri JWT cu expirare automată</li>
                <li>Backup-uri criptate și securizate</li>
                <li>Monitorizarea activității suspecte</li>
                <li>Firewall-uri și protecție DDoS</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 text-green-700">Măsuri Organizatorice:</h3>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Acces restricționat la date (need-to-know basis)</li>
                <li>Instruirea personalului în protecția datelor</li>
                <li>Politici interne de securitate</li>
                <li>Audituri regulate de securitate</li>
                <li>Proceduri de răspuns la incidente</li>
                <li>Contracte de confidențialitate</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Transferuri Internaționale de Date</h2>
          <p className="mb-4">
            Unele dintre datele dumneavoastră pot fi transferate și procesate în afara Spațiului Economic European (SEE) 
            de către partenerii noștri (Google, Stripe). Aceste transferuri se bazează pe:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Decizii de adecvare ale Comisiei Europene</li>
            <li>Clauze contractuale standard aprobate de UE</li>
            <li>Programe de certificare (ex: Privacy Shield pentru anumite companii)</li>
            <li>Consimțământul explicit al utilizatorului</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Cookies și Tehnologii Similare</h2>
          <p className="mb-4">
            Pentru informații detaliate despre utilizarea cookies-urilor, consultați{' '}
            <a href="/cookies-policy" className="text-blue-600 underline font-semibold">Politica de Cookies</a>.
          </p>
          
          <h3 className="text-lg font-medium mb-3 text-blue-700">Rezumat utilizare cookies:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li><strong>Cookies esențiale:</strong> autentificare, securitate, funcționalități de bază</li>
            <li><strong>Cookies de preferințe:</strong> setări utilizator, limba, tema</li>
            <li><strong>Nu folosim cookies de tracking sau publicitate</strong></li>
          </ul>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Minori</h2>
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-800">
              <strong>Serviciile noastre sunt destinate persoanelor cu vârsta de minimum 16 ani.</strong> 
              Nu colectăm în mod intenționat date personale de la copii sub 16 ani. 
              Dacă aflăm că am colectat astfel de date, le vom șterge imediat.
            </p>
          </div>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Modificări ale Politicii</h2>
          <p className="mb-4">
            Această politică poate fi actualizată periodic pentru a reflecta modificările în:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Legislația aplicabilă în materie de protecția datelor</li>
            <li>Serviciile și funcționalitățile platformei</li>
            <li>Practicile noastre de procesare a datelor</li>
          </ul>
          <p className="mb-4">
            <strong>Notificare modificări:</strong> Orice modificare semnificativă va fi comunicată prin:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Email către toți utilizatorii înregistrați</li>
            <li>Notificare în platformă la următoarea autentificare</li>
            <li>Actualizarea datei "Ultima actualizare" de la începutul acestei politici</li>
          </ul>
        </section>

        {/* Section 11 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. Contact și Plângeri</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2">Contact Direct</h3>
              <p className="text-sm mb-2"><strong>Email:</strong> contact@jobs-europa.com</p>
              <p className="text-sm mb-2"><strong>Telefon:</strong> +40 757 758 647</p>
              <p className="text-sm mb-2"><strong>Răspuns în:</strong> maximum 30 zile</p>
              <p className="text-sm"><strong>Pentru urgențe:</strong> menționați "GDPR URGENT" în subiect</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">🏛️ Autoritatea de Supraveghere</h3>
              <p className="text-sm mb-2">
                Dacă nu sunteți mulțumit de răspunsul nostru, puteți depune o plângere la:
              </p>
              <p className="text-sm mb-1"><strong>Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)</strong></p>
              <p className="text-sm mb-1">Website: <a href="https://www.dataprotection.ro" className="text-blue-600 underline">www.dataprotection.ro</a></p>
              <p className="text-sm">Email: anspdcp@dataprotection.ro</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <p className="text-center text-gray-500 text-sm">
          Această politică de confidențialitate este conformă cu Regulamentul General privind Protecția Datelor (GDPR) 
          și legislația română aplicabilă. Documentul conține {new Date().toLocaleDateString('ro-RO')} aproximativ 2,800 de cuvinte.
        </p>
      </div>
    </div>
  );
} 