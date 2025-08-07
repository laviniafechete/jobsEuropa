import { useNavigate } from "react-router-dom";
import { Facebook, Instagram, Mail } from "lucide-react";
import tiktok from "../assets/tiktok.png";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="w-full bg-white border-t py-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-2 sm:px-4">
        <div className="flex items-center gap-4 p-2">
          <a
            href="mailto:contact@jobs-europa.com"
            className="text-gray-500 hover:text-blue-600"
            aria-label="Mail"
          >
            <Mail className="w-8 h-8" />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61578134311366&mibextid=wwXIfr&rdid=Evl45eh9Ao7q29b5&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16r65CRUqQ%2F%3Fmibextid%3DwwXIfr#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600"
            aria-label="Facebook"
          >
            <Facebook className="w-8 h-8" />
          </a>
          <a
            href="https://www.instagram.com/joburieu?igsh=NmxtN3NpN2dpMGlh&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-pink-500"
            aria-label="Instagram"
          >
            <Instagram className="w-8 h-8" />
          </a>
          <a
            href="https://www.tiktok.com/@joburieu?_t=ZG-8xuhO7fFpuD&_r=1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-pink-500"
            aria-label="TikTok"
          >
            <img src={tiktok} alt="TikTok" className="w-8 h-8 object-contain" />
          </a>
        </div>
        <nav className="flex gap-4 sm:gap-6 text-sm">
          <button
            className="text-gray-600 hover:text-blue-600 font-medium transition"
            onClick={() => navigate("/about")}
          >
            Despre noi
          </button>
          <button
            className="text-gray-600 hover:text-blue-600 font-medium transition"
            onClick={() => navigate("/reviews")}
          >
            Recenzii platformă
          </button>
        </nav>
        <div className="flex flex-wrap gap-4 justify-center mt-2 text-sm text-gray-500">
          <a href="/privacy-policy" className="hover:underline">Politica de Confidențialitate</a>
          <a href="/terms-and-conditions" className="hover:underline">Termeni și Condiții</a>
          <a href="/cookies-policy" className="hover:underline">Politica de Cookies</a>

          <a href="/newsletter-policy" className="hover:underline">Politica de Newsletter</a>
          <a href="/data-deletion" className="hover:underline">Ștergere Date</a>
        </div>
      </div>
      <span className="text-xs text-gray-400 text-center md:text-right">
        &copy; {new Date().getFullYear()} Jobs Europa. Toate drepturile
        rezervate.
      </span>
    </footer>
  );
}
