import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import toast from 'react-hot-toast';

function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none"
              >
                {mobileMenuOpen ? 'Đóng' : 'Menu'}
              </button>
              <div className="ml-2 md:ml-0 flex items-center">
                <Logo variant="dark" linkTo="/admin/dashboard" />
              </div>
            </div>
            <div className="flex items-center">
              <Link
                to="/admin/events/new"
                className="hidden md:flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                New Event
              </Link>
              <button
                onClick={handleLogout}
                className="ml-4 flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg fixed inset-y-0 left-0 z-30 w-64 transform transition duration-300">
          <div className="pt-5 pb-4 px-2">
            <div className="flex items-center px-4">
              <Logo variant="dark" linkTo="/admin/dashboard" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="ml-auto p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                Đóng
              </button>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    location.pathname === item.path
                      ? 'bg-red-100 text-red-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/admin/events/new"
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-red-600 hover:bg-gray-50 hover:text-red-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                New Event
              </Link>
            </nav>
          </div>
        </div>
      )}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;