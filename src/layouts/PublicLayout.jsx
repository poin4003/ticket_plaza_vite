import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Logo from '../components/common/Logo';

function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/home"
                className="text-gray-700 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Events
              </Link>
              <Link
                to="/booking/lookup"
                className="flex items-center text-gray-700 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Check Booking
              </Link>
              <Link
                to="/login"
                className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Admin Login
              </Link>
            </nav>

            {/* Mobile Navigation Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-700 hover:text-red-600 p-2 rounded-md focus:outline-none"
                aria-label="Toggle menu"
              >
                {menuOpen ? 'Đóng' : 'Menu'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1 px-4">
              <Link
                to="/home"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
              >
                Events
              </Link>
              <Link
                to="/booking/lookup"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
              >
                Check Booking
              </Link>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-700"
              >
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Logo variant="light" />
              <p className="mt-4 text-sm">
                Your premier destination for event tickets. Find and book the hottest events in your area.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/home" className="hover:text-red-300 transition-colors">Browse Events</Link></li>
                <li><Link to="/booking/lookup" className="hover:text-red-300 transition-colors">Check My Booking</Link></li>
                <li><Link to="/login" className="hover:text-red-300 transition-colors">Admin Portal</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <address className="not-italic text-sm space-y-2">
                <p>123 Event Avenue</p>
                <p>Ticket City, TC 12345</p>
                <p>Email: <a href="mailto:info@ticketplaza.com" className="hover:text-red-300 transition-colors">info@ticketplaza.com</a></p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
            <p>© {new Date().getFullYear()} TicketPlaza. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;