import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FeatureSection from "./FeatureSection";

export default function HeroSection() {
  return (
    <div
      className="relative min-h-screen text-white overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://4kwallpapers.com/images/walls/thumbs_3t/17330.png')",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-800/20 via-purple-800/10 to-black" />

      {/* Hero Card */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 py-20 mt-28 backdrop-blur-md bg-white/5 rounded-3xl border border-white/10 shadow-2xl text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-600">
          Welcome to <span className="text-white">Excel Analytics</span> Platform
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Transform your Excel data into powerful, actionable visual insights effortlessly.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:scale-105 transition-transform duration-200 shadow-md"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 rounded-full border border-indigo-500 hover:bg-indigo-600 hover:text-white transition"
          >
            Login
          </Link>
        </div>
      </motion.div>

      {/* Feature Section (extracted) */}
      <FeatureSection />
    </div>
  );
}
