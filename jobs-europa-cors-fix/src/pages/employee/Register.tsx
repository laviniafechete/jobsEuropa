import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Eye, EyeOff, Mail, Phone, ArrowLeft, CheckCircle } from "lucide-react";
import PhoneInput from '../../components/PhoneInput';
import { getApiUrl } from '../../config/env';

export default function Register() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  
  const [registerMethod, setRegisterMethod] = useState<"email" | "phone">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Common fields
  const [name, setName] = useState("");
  
  // Email registration fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Phone registration fields
  const [phone, setPhone] = useState({ prefix: '+40', number: '' });
  const [phonePassword, setPhonePassword] = useState("");
  const [phoneConfirmPassword, setPhoneConfirmPassword] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [showSmsInput, setShowSmsInput] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      showError('Trebuie să accepți Politica de Confidențialitate și Termenii și Condițiile!');
      return;
    }
    if (isLoading) return;

    if (!name || !email || !password || !confirmPassword) {
      showError("Toate câmpurile sunt obligatorii");
      return;
    }

    if (password !== confirmPassword) {
      showError("Parolele nu se potrivesc");
      return;
    }

    if (password.length < 6) {
      showError("Parola trebuie să aibă cel puțin 6 caractere");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(getApiUrl("/auth/register-user"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          registerMethod: "email",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Eroare la înregistrare");
      }

      showSuccess("Cont creat cu succes! Verifică email-ul pentru a activa contul.");
      
      // Show success message and redirect to login
      setTimeout(() => {
        navigate("/employee/login");
      }, 2000);
    } catch (error: any) {
      showError(error.message || "Eroare la înregistrare. Vă rugăm încercați din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      showError('Trebuie să accepți Politica de Confidențialitate și Termenii și Condițiile!');
      return;
    }
    if (isLoading || isSendingSms) return;

    if (!showSmsInput) {
      // First step: Register with phone
      if (!name || !phone.number) {
        showError("Numele și numărul de telefon sunt obligatorii");
        return;
      }

      setIsSendingSms(true);
      try {
        const response = await fetch(getApiUrl("/auth/register-user"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            phone: phone.prefix + phone.number,
            registerMethod: "phone"
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || "Eroare la înregistrare");
        }

        setRegistrationData(data.data);
        setShowSmsInput(true);
        showSuccess("Cont creat! Verifică telefonul pentru codul de confirmare.");
      } catch (error: any) {
        showError(error.message || "Eroare la înregistrare. Vă rugăm încercați din nou.");
      } finally {
        setIsSendingSms(false);
      }
    } else {
      // Second step: Verify SMS and set password
      if (!smsCode || !phonePassword || !phoneConfirmPassword) {
        showError("Toate câmpurile sunt obligatorii");
        return;
      }

      if (phonePassword !== phoneConfirmPassword) {
        showError("Parolele nu se potrivesc");
        return;
      }

      if (phonePassword.length < 6) {
        showError("Parola trebuie să aibă cel puțin 6 caractere");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(getApiUrl("/auth/verify-phone-registration"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phone.prefix + phone.number,
            smsCode,
            password: phonePassword
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || "Eroare la verificarea SMS-ului");
        }

        showSuccess("Cont activat cu succes! Te poți autentifica acum.");
        
        // Redirect to login
        setTimeout(() => {
          navigate("/employee/login");
        }, 2000);
      } catch (error: any) {
        showError(error.message || "Eroare la verificarea SMS-ului. Vă rugăm încercați din nou.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBackToPhoneInput = () => {
    setShowSmsInput(false);
    setSmsCode("");
    setRegistrationData(null);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as Romanian phone number
    if (digits.startsWith('0')) {
      return digits.replace(/(\d{1})(\d{3})(\d{3})(\d{3})/, '$1$2$3$4');
    } else if (digits.startsWith('40')) {
      return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '0$2$3$4');
    }
    
    return digits;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {showSmsInput ? "Verificare telefon" : "Înregistrare"}
            </h1>
            <p className="text-gray-600">
              {showSmsInput 
                ? "Completează verificarea telefonului"
                : "Creează contul tău de candidat"
              }
            </p>
          </div>

          {/* Registration Method Tabs */}
          {!showSmsInput && (
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setRegisterMethod("email")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                  registerMethod === "email"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </button>
              <button
                onClick={() => setRegisterMethod("phone")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                  registerMethod === "phone"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Telefon
              </button>
            </div>
          )}

          {/* Email Registration Form */}
          {registerMethod === "email" && !showSmsInput && (
            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nume complet
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Numele tău"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="exemplu@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parolă
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Parola ta"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmă parola
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirmă parola"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="acceptTerms" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} />
                <label htmlFor="acceptTerms" className="text-sm">Sunt de acord cu <a href="/privacy-policy" className="underline">Politica de Confidențialitate</a> și <a href="/terms-and-conditions" className="underline">Termenii și Condițiile</a></label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {isLoading ? "Se înregistrează..." : "Înregistrare"}
              </button>
            </form>
          )}

          {/* Phone Registration Form */}
          {registerMethod === "phone" && (
            <form onSubmit={handlePhoneRegister} className="space-y-4">
              {!showSmsInput ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nume complet
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Numele tău"
                      required
                    />
                  </div>

                  <PhoneInput
                    label="Număr de telefon"
                    value={phone}
                    onChange={setPhone}
                    required
                  />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Cod de verificare
                    </label>
                    <button
                      type="button"
                      onClick={handleBackToPhoneInput}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      <ArrowLeft className="w-3 h-3 mr-1" />
                      Schimbă numărul
                    </button>
                  </div>
                  <input
                    type="text"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Codul a fost trimis la {phone.prefix + phone.number}
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parolă
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={phonePassword}
                        onChange={(e) => setPhonePassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Parola ta"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmă parola
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={phoneConfirmPassword}
                        onChange={(e) => setPhoneConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirmă parola"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="acceptTerms" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} />
                <label htmlFor="acceptTerms" className="text-sm">Sunt de acord cu <a href="/privacy-policy" className="underline">Politica de Confidențialitate</a> și <a href="/terms-and-conditions" className="underline">Termenii și Condițiile</a></label>
              </div>

              <button
                type="submit"
                disabled={isLoading || isSendingSms}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {isLoading 
                  ? "Se verifică..." 
                  : isSendingSms 
                    ? "Se trimite SMS..." 
                    : showSmsInput 
                      ? "Activează contul" 
                      : "Trimite codul SMS"
                }
              </button>
            </form>
          )}

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/employee/login"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Ai deja cont? Autentifică-te
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
