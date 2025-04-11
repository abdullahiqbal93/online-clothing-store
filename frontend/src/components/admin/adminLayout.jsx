import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/admin/Sidebar';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 overflow-visible">
      <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-lg font-bold">Flexxy Admin</h1>
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={closeMobileMenu}
        />
      )}

      <div
        className={`${
          isMobileMenuOpen
            ? 'block fixed z-30 h-full max-h-screen w-64'
            : 'hidden md:block md:fixed md:top-0 md:left-0 md:h-full md:overflow-y-visible'
        } text-white transition-all duration-300`}
      >
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      </div>

      <main
        className={`flex-1 p-4 sm:p-6 overflow-y-auto transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-[220px]' : 'md:ml-[70px]'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;