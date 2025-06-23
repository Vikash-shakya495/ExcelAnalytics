import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CallToActionSection() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-950 via-black to-pink-950 py-24 px-6 overflow-hidden">
      {/* Decorative glowing blobs */}
      <div className="absolute -top-20 left-1/3 w-72 h-72 bg-indigo-500 rounded-full blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500 rounded-full blur-[140px] opacity-25 animate-pulse" />
  
      {/* Main content */}
      <motion.div
        className="max-w-3xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
          Ready to Turn Spreadsheets Into Smart Decisions?
        </h2>
        <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-8">
          Discover insights, trends, and possibilities hidden in your Excel data — with zero coding required.
        </p>
  
        <Link
          to="/signup"
          className="inline-block bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-semibold text-lg px-10 py-4 rounded-full shadow-xl hover:shadow-pink-500/50 hover:scale-105 transition-all duration-300"
        >
          🚀 Get Started Now
        </Link>
  
        <p className="text-sm text-gray-500 mt-4 italic">
          No credit card required • Start your free journey today
        </p>
      </motion.div>
    </section>
  );
}
