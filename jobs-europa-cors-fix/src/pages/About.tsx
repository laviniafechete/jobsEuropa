import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <section className="w-full max-w-2xl mt-10 mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Despre Jobs Europa
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Jobs Europa este o platformă modernă, creată pentru a conecta rapid
            și sigur angajații și angajatorii din domenii precum construcții,
            menaj, curățenie, îngrijire bătrâni și multe altele, atât în România
            cât și în Belgia și Olanda.
          </p>
          <p className="text-gray-600 mb-4">
            Misiunea noastră este să simplificăm procesul de angajare, să oferim
            transparență și să susținem siguranța și respectul reciproc între
            toți utilizatorii platformei.
          </p>
          <p className="text-gray-600">
            Platforma este gândită pentru utilizatori cu experiență tehnică
            redusă, cu o interfață intuitivă, suport rapid pe WhatsApp și
            funcționalități adaptate pieței muncii moderne.
          </p>
        </section>
      </main>
      {/* Footer eliminat */}
    </div>
  );
}
