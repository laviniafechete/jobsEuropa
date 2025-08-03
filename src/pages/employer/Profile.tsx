import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { API_BASE_URL } from "../../config/env";

export default function EmployerProfile() {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      showError("Completează toate câmpurile pentru schimbarea parolei!");
      return;
    }
    if (newPassword.length < 6) {
      showError("Parola nouă trebuie să aibă minim 6 caractere!");
      return;
    }
    if (newPassword !== confirmPassword) {
      showError("Parolele nu coincid!");
      return;
    }
    setChanging(true);
    try {
      const res = await fetch(`${API_BASE_URL}/employer/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess("Parola a fost schimbată cu succes!");
        setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      } else {
        showError(data.error?.message || "Eroare la schimbarea parolei");
      }
    } catch (e: any) {
      showError(e.message || "Eroare la schimbarea parolei");
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 mt-20 pt-24">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="inline-block bg-green-100 p-2 rounded-full mr-2">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 21V7a2 2 0 0 1 2-2h3V3h4v2h3a2 2 0 0 1 2 2v14H3Z" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 21v-4a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2v4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
        Schimbă parola
      </h2>
      <div className="flex gap-2 mb-8">
        <button
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
          onClick={() => navigate("/employer/home")}
        >
          &larr; Înapoi la home
        </button>
      </div>
      <form className="bg-gray-50 border rounded p-4 mb-6" onSubmit={handleChangePassword}>
        <h3 className="font-bold mb-2">Schimbă parola</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Parola veche</label>
          <input type="password" className="border rounded px-2 py-1 w-full" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Parola nouă</label>
          <input type="password" className="border rounded px-2 py-1 w-full" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Confirmă parola nouă</label>
          <input type="password" className="border rounded px-2 py-1 w-full" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} />
        </div>
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded mt-2" disabled={changing}>
          {changing ? "Se schimbă..." : "Schimbă parola"}
        </button>
      </form>
    </div>
  );
} 