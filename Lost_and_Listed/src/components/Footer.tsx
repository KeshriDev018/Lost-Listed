import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-400 border-t border-gray-800 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Brand Section */}
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Lost & Listed
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              A student-powered platform to report lost and found items,
              exchange goods, and stay connected on campus.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold text-lg mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-white transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/report-lost"
                  className="hover:text-white transition-colors duration-300"
                >
                  Report Lost Item
                </Link>
              </li>
              <li>
                <Link
                  to="/report-found"
                  className="hover:text-white transition-colors duration-300"
                >
                  Report Found Item
                </Link>
              </li>
              <li>
                <Link
                  to="/marketplace"
                  className="hover:text-white transition-colors duration-300"
                >
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-right space-y-3">
            <h3 className="text-white font-semibold text-lg mb-3">
              Connect With Us
            </h3>
            <div className="flex justify-center md:justify-end gap-4">
              <a
                href="#"
                className="hover:text-white transition-transform transform hover:scale-110"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-white transition-transform transform hover:scale-110"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="hover:text-white transition-transform transform hover:scale-110"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://github.com/"
                className="hover:text-white transition-transform transform hover:scale-110"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Lost & Listed — Made with{" "}
          <span className="text-red-500">❤️</span> by{" "}
          <span className="font-semibold">team CodeSpire</span>
        </div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-70" />
    </footer>
  );
}
