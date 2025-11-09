import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import type { User } from "../../stores/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Eye, EyeOff, Mail, Phone, ArrowLeft } from "lucide-react";
import PhoneInput from "../../components/PhoneInput";
import { getApiUrl, GOOGLE_OAUTH_URL } from "../../config/env";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();

  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone login fields
  const [phone, setPhone] = useState({ prefix: "+40", number: "" });
  const [smsCode, setSmsCode] = useState("");
  const [showSmsInput, setShowSmsInput] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!email || !password) {
      showError("Toate câmpurile sunt obligatorii");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(getApiUrl("/auth/login-user"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          loginMethod: "email",
        }),
      });

      const data: {
        data: { token: string; user: User };
        error?: { message?: string };
      } = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Eroare la autentificare");
      }

      await login(data.data.token, "user", data.data.user);
      showSuccess("Autentificare reușită!");
      navigate("/employee/home");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Eroare la autentificare. Vă rugăm încercați din nou.";
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSendingSms) return;

    if (!phone.number) {
      showError("Numărul de telefon este obligatoriu");
      return;
    }

    if (!showSmsInput) {
      // Send SMS code
      setIsSendingSms(true);
      try {
        const response = await fetch(getApiUrl("/auth/login-user"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phone.prefix + phone.number,
            loginMethod: "phone",
          }),
        });

        const data: {
          data?: { requiresSmsVerification?: boolean };
          error?: { message?: string };
        } = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || "Eroare la trimiterea SMS-ului");
        }

        if (data.data.requiresSmsVerification) {
          setShowSmsInput(true);
          showSuccess("Codul SMS a fost trimis!");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Eroare la trimiterea SMS-ului. Vă rugăm încercați din nou.";
        showError(errorMessage);
      } finally {
        setIsSendingSms(false);
      }
    } else {
      // Verify SMS code
      if (!smsCode) {
        showError("Codul SMS este obligatoriu");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(getApiUrl("/auth/verify-sms"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phone.prefix + phone.number,
            smsCode,
          }),
        });

        const data: {
          data: { token: string; user: User };
          error?: { message?: string };
        } = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || "Eroare la verificarea SMS-ului");
        }

        await login(data.data.token, "user", data.data.user);
        showSuccess("Autentificare reușită!");
        navigate("/employee/home");
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Eroare la verificarea SMS-ului. Vă rugăm încercați din nou.";
        showError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBackToPhoneInput = () => {
    setShowSmsInput(false);
    setSmsCode("");
  };

  // OAuth login handler
  const handleOAuthLogin = () => {
    window.location.href = GOOGLE_OAUTH_URL;
  };

  // Prevent redirect to home if on reset-password page
  useEffect(() => {
    if (
      window.location.pathname === "/employee/reset-password" ||
      window.location.pathname.startsWith("/employee/reset-password")
    ) {
      // Do not redirect
      return;
    }
    // Existing logic (if any) for redirecting authenticated users
    // Example:
    // if (token) navigate('/employee/home');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {showSmsInput ? "Verificare SMS" : "Autentificare"}
            </h1>
            <p className="text-gray-600">
              {showSmsInput ? "Introdu codul primit prin SMS" : "Conectează-te la contul tău"}
            </p>
          </div>

          {/* Login Method Tabs */}
          {!showSmsInput && (
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setLoginMethod("email")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                  loginMethod === "email"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </button>
              <button
                onClick={() => setLoginMethod("phone")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                  loginMethod === "phone"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Telefon
              </button>
            </div>
          )}

          {/* Email Login Form */}
          {loginMethod === "email" && !showSmsInput && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Parolă</label>
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {isLoading ? "Se autentifică..." : "Autentificare"}
              </button>
            </form>
          )}

          {/* Phone Login Form */}
          {loginMethod === "phone" && (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              {!showSmsInput ? (
                <PhoneInput label="Număr de telefon" value={phone} onChange={setPhone} required />
              ) : (
                <div>
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
                    onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Codul a fost trimis la {phone.prefix + phone.number}
                  </p>
                </div>
              )}

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
                  ? "Verifică codul"
                  : "Trimite codul SMS"}
              </button>
            </form>
          )}

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/employee/register"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Nu ai cont? Înregistrează-te
            </Link>
            <div>
              <Link
                to="/employee/reset-password"
                className="text-gray-600 hover:text-gray-700 text-sm"
              >
                Ai uitat parola?
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleOAuthLogin("google")}
              className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-100 transition"
            >
              <span className="w-6 h-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
                  <g>
                    <path
                      fill="#4285F4"
                      d="M24 9.5c3.54 0 6.7 1.22 9.2 3.23l6.9-6.9C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.82 2.69 14.09l8.06 6.26C12.36 13.98 17.67 9.5 24 9.5z"
                    />
                    <path
                      fill="#34A853"
                      d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.18 5.59C43.98 37.13 46.1 31.36 46.1 24.55z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.75 28.35c-.48-1.44-.75-2.97-.75-4.55s.27-3.11.75-4.55l-8.06-6.26C1.01 16.64 0 20.19 0 24c0 3.81 1.01 7.36 2.69 10.55l8.06-6.2z"
                    />
                    <path
                      fill="#EA4335"
                      d="M24 48c6.18 0 11.36-2.05 15.14-5.59l-7.18-5.59c-2 1.34-4.56 2.13-7.96 2.13-6.33 0-11.64-4.48-13.25-10.55l-8.06 6.2C6.73 42.18 14.82 48 24 48z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </g>
                </svg>
              </span>
              Continuă cu Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
