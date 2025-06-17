import { motion } from "framer-motion";

const steps = [
  {
    title: "Upload Your Excel Sheet",
    description: "Drag and drop your data or use a ready-made template to get started instantly.",
  },
  {
    title: "Visualize Instantly",
    description: "Automatically generate stunning charts, dashboards, and tables based on your data.",
  },
  {
    title: "Share & Export",
    description: "Download your insights or share live dashboards securely with your team.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-black via-indigo-950 to-black overflow-hidden">
      {/* Radial glowing blobs */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-pink-500 opacity-20 blur-[120px] rounded-full" />
      <div className="absolute -bottom-20 right-10 w-[300px] h-[300px] bg-indigo-600 opacity-20 blur-[100px] rounded-full" />

      {/* Layout wrapper */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative group">
            <img
              src="https://img.freepik.com/premium-photo/seo-purple-lightening-big-icon_802140-2837.jpg"
              alt="Data analysis"
              className="rounded-2xl shadow-xl  border-white/10 backdrop-blur-sm group-hover:scale-[1.02] transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 rounded-2xl pointer-events-none" />
          </div>
        </motion.div>

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-indigo-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            How It Works
          </h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                    <p className="text-gray-300 mt-1 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
