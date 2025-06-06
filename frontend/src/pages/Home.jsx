import { Link } from "react-router-dom";
import { FaUpload, FaChartLine, FaShieldAlt, FaUsers, FaHeadset, FaCogs } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-600">
          Welcome to Excel Analytics Platform
        </h1>
        <p className="text-lg max-w-2xl mb-8">
          Transform your Excel data into powerful, actionable visual insights effortlessly.
        </p>
        <div className="space-x-4">
          <Link
            to="/signup"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:brightness-110 font-semibold shadow-lg transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="inline-block px-8 py-3 rounded-full border border-indigo-600 hover:bg-indigo-600 hover:text-white transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            icon: <FaUpload size={36} className="text-indigo-500 mb-3" />,
            title: "Seamless Data Upload",
            desc: "Upload your Excel files quickly and securely with support for multiple formats.",
          },
          {
            icon: <FaChartLine size={36} className="text-pink-500 mb-3" />,
            title: "Dynamic Visualizations",
            desc: "Generate customizable charts and graphs that update in real-time as your data changes.",
          },
          {
            icon: <FaCogs size={36} className="text-purple-500 mb-3" />,
            title: "Insightful Analytics",
            desc: "Leverage advanced analytics tools to identify trends, patterns, and key metrics with ease.",
          },
        ].map(({ icon, title, desc }, i) => (
          <motion.div
            key={i}
            className="feature-card bg-white/5 p-6 rounded-xl shadow-lg border border-white/20 backdrop-blur-md transition hover:bg-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.2 }}
          >
            {icon}
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-gray-300">{desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gradient-to-r from-indigo-950 via-transparent to-pink-950 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-6 text-white">
            Why Choose Excel Analytics Platform?
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto mb-10">
            Our platform simplifies your data analysis workflow by providing a powerful yet easy-to-use interface.
            Whether you're a business professional or a data scientist, Excel Analytics empowers you to make data-driven decisions faster.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaUsers size={28} className="mx-auto mb-2 text-indigo-400" />,
                title: "User-Friendly Interface",
                desc: "Intuitive design that requires no technical background. Just upload and analyze.",
              },
              {
                icon: <FaShieldAlt size={28} className="mx-auto mb-2 text-pink-400" />,
                title: "Secure & Private",
                desc: "Your data is encrypted and securely stored. We prioritize your privacy.",
              },
              {
                icon: <FaHeadset size={28} className="mx-auto mb-2 text-purple-400" />,
                title: "24/7 Support",
                desc: "Our expert team is here to help you anytime with any issues or questions.",
              },
            ].map(({ icon, title, desc }, i) => (
              <motion.div
                key={i}
                className="p-6 bg-white/10 rounded-lg border border-white/20 shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.3 }}
              >
                {icon}
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-300">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section with images */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.img
          src="https://images.unsplash.com/photo-1562577309-2592ab84b1bc?auto=format&fit=crop&w=600&q=80"
          alt="Data analysis"
          className="rounded-xl shadow-lg"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        />
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-extrabold mb-6">How It Works</h2>
          <p className="text-gray-300 mb-4">
            Upload your Excel file, and our intelligent system parses the data and generates comprehensive visual reports.
          </p>
          <p className="text-gray-300 mb-4">
            Customize charts and filter insights with easy drag-and-drop controls — no coding required.
          </p>
          <p className="text-gray-300">
            Download or share your reports instantly to streamline your decision-making process.
          </p>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white/5 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-600">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                name: "Anita Sharma",
                feedback:
                  "Excel Analytics helped me visualize complex data easily and present insights that impressed my entire team!",
                img: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              {
                name: "Raj Patel",
                feedback:
                  "The upload and visualization process is super smooth. Support is amazing when I had questions.",
                img: "https://randomuser.me/api/portraits/men/32.jpg",
              },
              {
                name: "Sneha Verma",
                feedback:
                  "I love the intuitive interface — made analytics so approachable for me and my small business.",
                img: "https://randomuser.me/api/portraits/women/68.jpg",
              },
            ].map(({ name, feedback, img }, i) => (
              <motion.div
                key={i}
                className="bg-black/30 p-6 rounded-xl shadow-lg border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              >
                <img
                  src={img}
                  alt={name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover border-2 border-indigo-600"
                />
                <p className="italic text-gray-300 mb-4">"{feedback}"</p>
                <p className="font-semibold">{name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center py-16 px-6">
        <h2 className="text-3xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-600">
          Ready to transform your Excel data?
        </h2>
        <Link
          to="/signup"
          className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:brightness-110 font-semibold shadow-lg transition"
        >
          Get Started Now
        </Link>
      </section>
    </div>
  );
}
