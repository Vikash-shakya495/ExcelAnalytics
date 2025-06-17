import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-20 px-6 relative overflow-hidden">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-950 via-transparent to-red-950" />

      {/* Optional subtle patterned background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-40 mix-blend-overlay"></div>

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        {/* Branding & Tagline */}
        <div className="text-center md:text-left max-w-sm space-y-4 z-10">
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
            Excel Analytics Platform
          </h2>
          <p className="text-gray-400 leading-relaxed text-sm md:text-base max-w-xs mx-auto md:mx-0">
            Empowering your business with data-driven decisions. Visualize, analyze, and grow with confidence.
          </p>

          <p className="text-xs text-gray-500 tracking-wide">
            © {new Date().getFullYear()} Excel Analytics. All rights reserved.
          </p>
        </div>

        {/* Social Icons Container */}
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 flex space-x-8 justify-center items-center z-10 shadow-lg">
          <a
            href="https://github.com/Vikash-shakya495/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-gray-100 transition-colors duration-300"
          >
            <FaGithub size={28} />
          </a>
          <a
            href="https://www.linkedin.com/in/vikash-shakya-978a052b2/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            <FaLinkedin size={28} />
          </a>
          <a
            href="https://medium.com/@vikashshakya367"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Medium"
            className="hover:text-green-600 transition-colors duration-300 font-semibold text-xl flex items-center justify-center"
            style={{ width: 28, height: 28 }}
          >
            M
          </a>
          <a
            href="https://x.com/vikashshakya367"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-blue-400 transition-colors duration-300"
          >
            <FaTwitter size={28} />
          </a>
        </div>
      </div>
    </footer>
  );
}
