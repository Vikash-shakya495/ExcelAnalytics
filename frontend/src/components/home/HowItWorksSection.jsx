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
    <section className="relative py-16 px-6 sm:px-8 bg-gradient-to-b from-black via-indigo-950 to-black overflow-hidden">
      {/* Radial glowing blobs */}
      <div className="absolute -top-24 -left-24 w-[350px] h-[350px] bg-pink-500 opacity-20 blur-[120px] rounded-full" />
      <div className="absolute -bottom-16 right-8 w-[250px] h-[250px] bg-indigo-600 opacity-20 blur-[100px] rounded-full" />

      {/* Layout wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-center relative z-10">
        
        {/* Image Section */}
        <div className="relative group">
          <img
            src="https://img.freepik.com/premium-photo/seo-purple-lightening-big-icon_802140-2837.jpg"
            alt="Data analysis"
            className="rounded-2xl shadow-xl border-white/10 backdrop-blur-sm group-hover:scale-[1.02] transition duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 rounded-2xl pointer-events-none" />
        </div>

        {/* Text Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 bg-gradient-to-r from-indigo-300 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            How It Works
          </h2>
          <div className="space-y-6 sm:space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">{step.title}</h3>
                    <p className="text-gray-300 mt-1 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
