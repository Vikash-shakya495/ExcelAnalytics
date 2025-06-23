// components/Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow px-2 sm:px-4 py-2 sm:py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
