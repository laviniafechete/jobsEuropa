import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow mt-10 mb-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Termeni și Condiții de Utilizare</h1>
      <p className="mb-6 text-gray-600">
        <strong>Ultima actualizare:</strong> {new Date().toLocaleDateString('ro-RO')} |{' '}
        <strong>Intrare în vigoare:</strong> {new Date().toLocaleDateString('ro-RO')}
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
        <p className="text-blue-800">
          <strong>Bine ai venit pe Jobs Europa!</strong> Acești termeni și condiții guvernează utilizarea platformei noastre de conectare între candidați și angajatori în domenii precum construcții, menaj, curățenie, îngrijire, transport și alte servicii specializate. Prin utilizarea serviciilor noastre, acceptați acești termeni în întregime.
        </p>
      </div>

      <div className="space-y-10">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Informații despre Operator și Platformă</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-3 text-blue-700">1.1 Date Operator:</h3>
            <ul className="space-y-1 text-sm">
              <li><strong>Denumire:</strong> Jobs Europa</li>
              <li><strong>Adresă email:</strong> <a href="mailto:contact@jobs-europa.com" className="text-blue-600 underline">contact@jobs-europa.com</a></li>
              <li><strong>Telefon:</strong> <a href="tel:+40757758647" className="text-blue-600 underline">+40 757 758 647</a></li>
              <li><strong>Website:</strong> jobs-europa.com</li>
              <li><strong>Legislație aplicabilă:</strong> Dreptul României și regulamentele UE</li>
            </ul>
          </div>

          <h3 className="text-lg font-medium mb-3 text-blue-700">1.2 Despre Platformă:</h3>
          <p className="mb-4">
            Jobs Europa este o platformă digitală care facilitează conectarea între candidați (persoane fizice în căutarea unui loc de muncă) 
            și angajatori (persoane fizice sau juridice care oferă oportunități de muncă) în domenii specifice precum:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Construcții și amenajări</li>
              <li>Electricitate și instalații</li>
              <li>Mecanică / Service auto</li>
              <li>Transport și livrări</li>
              <li>Logistică și depozit</li>
              <li>Curățenie și întreținere</li>
              <li>Horeca (bucătari, ospătari, hotel)</li>
              <li>Bone / Îngrijire copii</li>
              <li>Îngrijire bătrâni</li>
              <li>Agricultură și muncă sezonieră</li>
            </ul>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Menaj la domiciliu / Intern</li>
              <li>Confecții textile / Croitorie</li>
              <li>Muncă necalificată / Ajutor general</li>
              <li>Sudură și prelucrări metal</li>
              <li>Comerț / Casierie / Retail</li>
              <li>IT / Tehnologie</li>
              <li>Call center / Lucru de birou</li>
              <li>Educație / Meditații</li>
              <li>Lucru manual / Artizanat</li>
              <li>Lucru de acasă / Remote</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Definiții și Terminologie</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Termen</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Definiție</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Platforma</td>
                  <td className="border border-gray-300 px-4 py-2">Website-ul jobs-europa.com și toate serviciile asociate</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Candidat</td>
                  <td className="border border-gray-300 px-4 py-2">Persoană fizică înregistrată care caută oportunități de muncă</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Angajator</td>
                  <td className="border border-gray-300 px-4 py-2">Persoană fizică sau juridică care publică oferte de muncă</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Utilizator</td>
                  <td className="border border-gray-300 px-4 py-2">Orice persoană care accesează Platforma (candidat sau angajator)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Cont</td>
                  <td className="border border-gray-300 px-4 py-2">Profilul personal creat pe Platformă cu credențiale unice</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Abonament</td>
                  <td className="border border-gray-300 px-4 py-2">Serviciu plătit pentru angajatori (Trial, Basic, Premium)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Conținut</td>
                  <td className="border border-gray-300 px-4 py-2">Orice informație, text, imagine sau date publicate pe Platformă</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Acceptarea Termenilor și Condiții</h2>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-800">
              <strong>Prin utilizarea Platformei, confirmați că:</strong>
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Aveți minimum 16 ani și capacitate juridică deplină</li>
              <li>Ați citit și înțeles acești Termeni și Condiții</li>
              <li>Acceptați să fiți legat juridic de acești termeni</li>
              <li>Confirmați exactitatea informațiilor furnizate</li>
            </ul>
          </div>

          <h3 className="text-lg font-medium mb-3 text-blue-700">3.1 Modalități de Acceptare:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Bifarea checkbox-ului la înregistrare</li>
            <li>Utilizarea continuă a serviciilor după notificarea modificărilor</li>
            <li>Efectuarea unei plăți pentru abonament</li>
            <li>Aplicarea la un job sau publicarea unui anunț</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Servicii Oferite</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-blue-200 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-blue-700">4.1 Pentru Candidați (GRATUIT):</h3>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Înregistrare și creare cont</li>
                <li>Crearea și editarea CV-ului</li>
                <li>Căutarea și vizualizarea joburilor</li>
                <li>Aplicarea la ofertele de muncă</li>
                <li>Contactarea directă a angajatorilor</li>
                <li>Salvarea preferințelor și istoricului</li>
                <li>Notificări despre joburi noi</li>
                <li>Autentificare prin Google</li>
              </ul>
            </div>
            
            <div className="border border-green-200 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-green-700">4.2 Pentru Angajatori:</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-700">🆓 Trial (3 zile GRATUIT):</h4>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>Publicare joburi (limitat)</li>
                    <li>Vizualizare candidați (limitat)</li>
                    <li>Profil companie de bază</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">💼 Basic & Premium (PLĂTIT):</h4>
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    <li>Publicare joburi nelimitat</li>
                    <li>Acces complet la candidați</li>
                    <li>Filtrare avansată candidați</li>
                    <li>Statistici și analytics</li>
                    <li>Suport prioritar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Conturi de Utilizator și Securitate</h2>
          
          <h3 className="text-lg font-medium mb-3 text-blue-700">5.1 Crearea Contului:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Un utilizator poate avea un singur cont activ per tipologie (candidat sau angajator)</li>
            <li>Informațiile furnizate trebuie să fie reale, exacte și actualizate</li>
            <li>Vârsta minimă pentru utilizare este de 16 ani</li>
            <li>Email-ul și telefonul trebuie verificate pentru activarea completă</li>
          </ul>

          <h3 className="text-lg font-medium mb-3 text-blue-700">5.2 Securitatea Contului:</h3>
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-red-800 mb-2"><strong>Sunteți responsabil pentru:</strong></p>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Confidențialitatea parolei și datelor de autentificare</li>
              <li>Toate activitățile efectuate din contul dumneavoastră</li>
              <li>Notificarea imediată în cazul compromiterii contului</li>
              <li>Deconectarea din cont la sfârșitul sesiunii pe dispozitive publice</li>
            </ul>
          </div>

          <h3 className="text-lg font-medium mb-3 text-blue-700">5.3 Suspendarea și Închiderea Conturilor:</h3>
          <p className="mb-2">Ne rezervăm dreptul de a suspenda sau închide conturi în următoarele situații:</p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Furnizarea de informații false sau înșelătoare</li>
            <li>Încălcarea repetată a acestor termeni</li>
            <li>Comportament abuziv sau discriminatoriu</li>
            <li>Activități frauduloase sau ilegale</li>
            <li>Utilizarea de conturi multiple pentru a evita restricțiile</li>
            <li>Neplata abonamentelor (pentru angajatori)</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Reguli de Utilizare și Conduită</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3 text-green-700">PERMIS:</h3>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Utilizarea serviciilor conform destinației</li>
                <li>Publicarea de conținut legal și relevant</li>
                <li>Comunicarea respectuoasă cu alți utilizatori</li>
                <li>Raportarea problemelor și abuzurilor</li>
                <li>Actualizarea regulată a informațiilor</li>
                <li>Respectarea drepturilor de proprietate intelectuală</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 text-red-700">INTERZIS:</h3>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Publicarea de conținut fals, misleading sau discriminatoriu</li>
                <li>Hărțuirea, amenințarea sau intimidarea altor utilizatori</li>
                <li>Folosirea platformei pentru activități ilegale</li>
                <li>Încercări de hacking, spam sau malware</li>
                <li>Crearea de conturi false sau duplicare</li>
                <li>Colectarea neautorizată de date personale</li>
                <li>Ocolirea sistemelor de plată sau securitate</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h3 className="text-lg font-medium mb-3 text-gray-700">6.1 Reguli Specifice pentru Candidați:</h3>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>CV-ul trebuie să conțină informații reale și verificabile</li>
              <li>Aplicarea la joburi trebuie să fie serioasă și relevantă</li>
              <li>Nu este permisă aplicarea în masă fără citirea anunțului</li>
              <li>Comunicarea cu angajatorii trebuie să fie profesională</li>
              <li>Nu este permisă solicitarea directă de bani sau avansuri</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h3 className="text-lg font-medium mb-3 text-gray-700">6.2 Reguli Specifice pentru Angajatori:</h3>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Anunțurile trebuie să descrie poziții reale disponibile</li>
              <li>Salariile și beneficiile menționate trebuie să fie corecte</li>
              <li>Nu este permisă discriminarea pe criterii de vârstă, gen, religie etc.</li>
              <li>Cerințele pentru job trebuie să fie legale și realiste</li>
              <li>Nu este permisă colectarea de date personale în exces</li>
              <li>Plata abonamentelor trebuie să fie la timp</li>
            </ul>
          </div>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Sistem de Plăți și Abonamente</h2>
          
          <h3 className="text-lg font-medium mb-3 text-blue-700">7.1 Perioada de Trial:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Fiecare angajator beneficiază de 3 zile de trial gratuit</li>
            <li>Trial-ul începe din momentul completării profilului companiei</li>
            <li>După expirare, accesul la funcționalități este restricționat</li>
            <li>Un angajator poate beneficia de un singur trial per companie</li>
          </ul>

          <h3 className="text-lg font-medium mb-3 text-blue-700">7.2 Abonamente Plătite:</h3>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Aspect</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Basic</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Publicare joburi</td>
                  <td className="border border-gray-300 px-4 py-2">Nelimitat</td>
                  <td className="border border-gray-300 px-4 py-2">Nelimitat</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Vizualizare candidați</td>
                  <td className="border border-gray-300 px-4 py-2">Complet</td>
                  <td className="border border-gray-300 px-4 py-2">Complet</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Filtrare avansată</td>
                  <td className="border border-gray-300 px-4 py-2">De bază</td>
                  <td className="border border-gray-300 px-4 py-2">Avansată</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Suport</td>
                  <td className="border border-gray-300 px-4 py-2">Email</td>
                  <td className="border border-gray-300 px-4 py-2">Prioritar</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-medium mb-3 text-blue-700">7.3 Procesarea Plăților:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Toate plățile sunt procesate securizat prin <strong>Stripe</strong></li>
            <li>Acceptăm carduri Visa, Mastercard, American Express</li>
            <li>Plățile sunt în <strong>EUR</strong> și includ TVA conform legislației</li>
            <li>Factura este emisă automat și trimisă pe email</li>
            <li>Nu stocăm datele cardului - acestea sunt gestionate de Stripe</li>
          </ul>

          <h3 className="text-lg font-medium mb-3 text-blue-700">7.4 Politica de Rambursare:</h3>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Rambursările sunt posibile în primele 7 zile de la plată</li>
              <li>Solicitarea trebuie trimisă la contact@jobs-europa.com</li>
              <li>Rambursarea se efectuează în 5-10 zile lucrătoare</li>
              <li>Nu se rambursează serviciile deja utilizate complet</li>
            </ul>
          </div>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Proprietate Intelectuală</h2>
          
          <h3 className="text-lg font-medium mb-3 text-blue-700">8.1 Drepturi Jobs Europa:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Logo-ul, designul și interfața platformei</li>
            <li>Codul sursă și algoritmii proprietari</li>
            <li>Marca "Jobs Europa" și variantele sale</li>
            <li>Documentația și materialele de marketing</li>
          </ul>

          <h3 className="text-lg font-medium mb-3 text-blue-700">8.2 Drepturi Utilizatori:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Păstrați proprietatea asupra conținutului creat (CV-uri, anunțuri)</li>
            <li>Ne acordați licența de a afișa conținutul pe platformă</li>
            <li>Puteți șterge conținutul oricând</li>
            <li>Nu pretindem drepturi asupra conținutului vostru</li>
          </ul>

          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-800">
              <strong>Este strict interzisă:</strong> copierea, reproducerea, distribuirea sau modificarea elementelor proprietare ale platformei fără acordul nostru scris.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Limitarea Răspunderii</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-3 text-gray-700">9.1 Jobs Europa NU este responsabilă pentru:</h3>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Calitatea, legalitatea sau exactitatea anunțurilor publicate</li>
              <li>Comportamentul, acțiunile sau omisiunile utilizatorilor</li>
              <li>Rezultatul aplicărilor la joburi sau procesele de recrutare</li>
              <li>Daunele rezultate din utilizarea platformei</li>
              <li>Întreruperile temporare ale serviciului</li>
              <li>Pierderea de date din cauze tehnice</li>
              <li>Deciziile de angajare ale companiilor</li>
            </ul>
          </div>

          <h3 className="text-lg font-medium mb-3 text-blue-700">9.2 Limitele Răspunderii:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Răspunderea noastră este limitată la valoarea abonamentului plătit</li>
            <li>Nu suntem răspunzători pentru daune indirecte sau consecvențiale</li>
            <li>Utilizatorii își asumă riscurile utilizării platformei</li>
            <li>Recomandăm verificarea independentă a informațiilor</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-blue-800">
              <strong>Rolul nostru:</strong> Suntem o platformă tehnologică care facilitează conectarea dintre candidați și angajatori. Nu suntem agenție de plasare în muncă și nu participăm direct la procesul de angajare.
            </p>
          </div>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Încetarea Utilizării</h2>
          
          <h3 className="text-lg font-medium mb-3 text-blue-700">10.1 Încetare de către Utilizator:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Puteți închide contul oricând prin setările contului</li>
            <li>Puteți solicita ștergerea completă prin contact@jobs-europa.com</li>
            <li>Datele vor fi anonizate/șterse conform GDPR</li>
            <li>Abonamentele plătite rămân active până la expirare</li>
          </ul>

          <h3 className="text-lg font-medium mb-3 text-blue-700">10.2 Încetare de către Jobs Europa:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Suspendarea temporară pentru investigații</li>
            <li>Închiderea definitivă pentru încălcări grave</li>
            <li>Preaviz de 30 zile pentru modificări majore de serviciu</li>
            <li>Rambursarea proporțională a abonamentelor nefolosite</li>
          </ul>

          <h3 className="text-lg font-medium mb-3 text-blue-700">10.3 Efectele Încetării:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Pierderea accesului la toate funcționalitățile</li>
            <li>Ștergerea sau anonizarea datelor personale</li>
            <li>Încetarea obligațiilor reciproce</li>
            <li>Menținerea clauzelor de limitare a răspunderii</li>
          </ul>
        </section>

        {/* Section 11 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. Modificarea Termenilor</h2>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <h3 className="text-lg font-medium mb-3 text-yellow-700">11.1 Procedura de Modificare:</h3>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Notificare prin email către toți utilizatorii înregistrați</li>
              <li>Publicarea noilor termeni pe platformă cu evidențierea modificărilor</li>
              <li>Perioada de grație de 30 zile pentru acceptare</li>
              <li>Posibilitatea de a închide contul dacă nu acceptați modificările</li>
            </ul>
          </div>

          <h3 className="text-lg font-medium mb-3 text-blue-700">11.2 Tipuri de Modificări:</h3>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li><strong>Modificări minore:</strong> corecții de text, clarificări - fără notificare</li>
            <li><strong>Modificări majore:</strong> schimbări de servicii, prețuri - cu notificare 30 zile</li>
            <li><strong>Modificări legale:</strong> pentru conformitate legală - cu notificare imediată</li>
          </ul>
        </section>

        {/* Section 12 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">12. Legea Aplicabilă și Soluționarea Litigiilor</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2">Jurisdicție</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Legea aplicabilă:</strong> Dreptul României</li>
                <li><strong>Instanțe competente:</strong> Instanțele din România</li>
                <li><strong>Limba procedurii:</strong> Română</li>
                <li><strong>Conformitate UE:</strong> GDPR, Directiva serviciilor digitale</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">Soluționare Litigii</h3>
              <ol className="text-sm space-y-1 list-decimal ml-4">
                <li>Încercarea de soluționare amiabilă (30 zile)</li>
                <li>Mediere prin organizații acreditate</li>
                <li>Arbitraj comercial (pentru angajatori)</li>
                <li>Instanțele judecătorești ca ultimă instanță</li>
              </ol>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3 text-blue-700 mt-4">12.1 Consumatori:</h3>
          <p className="mb-4 text-sm">
            Candidații beneficiază de protecția acordată consumatorilor conform legislației române și europene, 
            inclusiv dreptul de a se adresa instanțelor din țara de reședință.
          </p>
        </section>

        {/* Section 13 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">13. Contact și Suport</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2">Contact General</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Email:</strong> contact@jobs-europa.com</li>
                <li><strong>Telefon:</strong> +40 757 758 647</li>
                <li><strong>WhatsApp:</strong> +40 757 758 647</li>
                <li><strong>Program:</strong> Luni-Vineri, 9:00-18:00</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Suport Specializat</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Probleme tehnice:</strong> Subiect "TECH"</li>
                <li><strong>Întrebări plăți:</strong> Subiect "BILLING"</li>
                <li><strong>Raportare abuz:</strong> Subiect "ABUSE"</li>
                <li><strong>GDPR requests:</strong> Subiect "GDPR"</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-green-800">
              <strong>Timp de răspuns:</strong> Ne angajăm să răspundem la toate solicitările în maximum 48 de ore în zile lucrătoare. Pentru urgențe, sunați la numărul de telefon.
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-center text-gray-600 text-sm mb-2">
            <strong>Acești Termeni și Condiții sunt efectivi din {new Date().toLocaleDateString('ro-RO')} și se aplică tuturor utilizatorilor platformei Jobs Europa.</strong>
          </p>
          <p className="text-center text-gray-500 text-xs">
            Documentul conține aproximativ 3,500 de cuvinte și 13 secțiuni principale. 
            Pentru întrebări despre acești termeni, contactați-ne la contact@jobs-europa.com.
          </p>
        </div>
      </div>
    </div>
  );
} 