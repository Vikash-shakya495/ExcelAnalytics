export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-10 text-center space-y-4">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
          Excel Analytics Platform
        </h2>

        <p className="text-sm md:text-base text-gray-400">
          Empowering insights through data. Built with ❤️ by passionate developers.
        </p>

        <div className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Excel Analytics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
