import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Anita Sharma",
    feedback: "Excel Analytics helped me visualize complex data easily and present insights that impressed my entire team!",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    name: "Raj Patel",
    feedback: "The upload and visualization process is super smooth. Support is amazing when I had questions.",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
  },
  {
    name: "Sneha Verma",
    feedback: "I love the intuitive interface — made analytics so approachable for me and my small business.",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative bg-gradient-to-br from-black via-indigo-950 to-black py-24 px-6 overflow-hidden">
      {/* Glowing background blobs */}
      <div className="absolute -top-24 -left-24 w-[300px] h-[300px] bg-indigo-500 opacity-20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-500 opacity-20 blur-[100px] rounded-full" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-12 bg-gradient-to-r from-indigo-400 to-pink-600 text-transparent bg-clip-text">
          What Our Users Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
          {testimonials.map(({ name, feedback, img, rating }, i) => (
            <motion.div
              key={i}
              className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <div className="flex flex-col items-center">
                <img
                  src={img}
                  alt={name}
                  className="w-16 h-16 rounded-full border-2 border-indigo-400 shadow-lg mb-4 object-cover"
                />
                <h3 className="text-white font-semibold text-lg">{name}</h3>
                <div className="flex gap-1 my-2">
                  {Array.from({ length: 5 }, (_, idx) => (
                    <FaStar
                      key={idx}
                      className={`${
                        idx < rating ? "text-yellow-400" : "text-gray-500"
                      } text-sm`}
                    />
                  ))}
                </div>
                <p className="text-gray-300 text-sm italic leading-relaxed mt-2">
                  “{feedback}”
                </p>
              </div>
              {/* Quote mark decoration */}
              <div className="absolute -top-6 left-6 text-6xl text-pink-500/20 select-none">
                “
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
