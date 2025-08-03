import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
  };
  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex flex-col sm:flex-row items-center justify-between z-50 shadow-lg">
      <span className="mb-2 sm:mb-0">Folosim cookies pentru a îmbunătăți experiența pe site. Vezi <a href="/cookies-policy" className="underline text-blue-300">Politica de Cookies</a>.</span>
      <div className="flex gap-2">
        <button onClick={handleAccept} className="bg-green-600 px-4 py-2 rounded text-white">Accept</button>
        <button onClick={handleDecline} className="bg-gray-600 px-4 py-2 rounded text-white">Respinge</button>
      </div>
    </div>
  );
} 