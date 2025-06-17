import { FaUpload, FaChartLine, FaCogs } from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  {
    icon: <FaUpload size={40} />,
    title: "Seamless Data Upload",
    desc: "Upload Excel files effortlessly with intelligent parsing and real-time progress.",
    color: "text-indigo-400 ring-indigo-500/50",
  },
  {
    icon: <FaChartLine size={40} />,
    title: "Dynamic Visualizations",
    desc: "Visualize your data with animated, interactive charts powered by smart templates.",
    color: "text-pink-400 ring-pink-500/50",
  },
  {
    icon: <FaCogs size={40} />,
    title: "Insightful Analytics",
    desc: "Get automated insights with customizable metrics & AI-driven suggestions.",
    color: "text-purple-400 ring-purple-500/50",
  },
];

// Variants for animation
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function FeatureSection() {
  return (
    <motion.section
      className="relative z-10 py-24 px-6 md:px-12 text-white bg-gradient-to-b from-transparent via-black/20 to-black/70"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      role="region"
      aria-label="Excel Analytics Premium Features"
    >
      {/* Section Heading */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Premium Features
        </h2>
        <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
          Elevate your data experience with advanced tools designed to simplify, visualize, and automate your workflow.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {features.map(({ icon, title, desc, color }, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className={`relative p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl text-center shadow-xl hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 group overflow-hidden`}
          >
            {/* Icon Glow */}
            <div
              className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full ring-4 ${color} bg-white/10 backdrop-blur-md shadow-inner animate-pulse group-hover:animate-bounce`}
            >
              <div className={`${color}`}>{icon}</div>
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-300 text-sm">{desc}</p>

            {/* Gradient ring effect */}
            <div className={`absolute inset-0 rounded-3xl group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-white/20 transition-all`} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
