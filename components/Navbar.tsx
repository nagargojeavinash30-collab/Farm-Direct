'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiMenu, FiX, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useAuthStore } from '@/lib/authStore';
import { useCartStore } from '@/lib/cartStore';

export default function Navbar() {
  const router = useRouter();
  const { user, isLoggedIn, logout, loadFromLocalStorage } = useAuthStore();
  const { items } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadFromLocalStorage();
  }, []);

  if (!mounted) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-primary-600">🌾</div>
          <span className="text-xl font-bold text-primary-600 hidden sm:inline">FarmDirect</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-primary-600 transition">
            Home
          </Link>
          <Link href="/marketplace" className="text-gray-700 hover:text-primary-600 transition">
            Marketplace
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition">
            Contact
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          {isLoggedIn && (
            <Link href="/cart" className="relative">
              <FiShoppingCart size={24} className="text-gray-700 hover:text-primary-600" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
          )}

          {/* Auth Buttons */}
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600"
              >
                <FiUser size={20} />
                <span>{user?.firstName}</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 border-t">
          <div className="container-custom py-4 flex flex-col gap-4">
            <Link href="/" className="text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link href="/marketplace" className="text-gray-700 hover:text-primary-600">
              Marketplace
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600">
              Contact
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-gray-700 hover:text-primary-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link href="/register" className="text-gray-700 hover:text-primary-600">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
