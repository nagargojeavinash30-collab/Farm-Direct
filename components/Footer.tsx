'use client';

import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="container-custom py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🌾</span>
              <span className="text-xl font-bold">FarmDirect</span>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering farmers and connecting markets for fresh, organic produce.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/marketplace" className="text-gray-400 hover:text-white transition">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* For Farmers */}
          <div>
            <h3 className="font-bold text-lg mb-4">For Farmers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/register" className="text-gray-400 hover:text-white transition">
                  Sell Produce
                </Link>
              </li>
              <li>
                <Link href="/farmer-guide" className="text-gray-400 hover:text-white transition">
                  Farmer Guide
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">📧 support@farmdirect.in</li>
              <li className="text-gray-400">📱 1800-FARM-123</li>
              <li className="text-gray-400">📍 Bangalore, India</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 py-8">
          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-6">
            <Link href="#" className="text-gray-400 hover:text-white transition">
              <FiFacebook size={20} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition">
              <FiTwitter size={20} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition">
              <FiInstagram size={20} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition">
              <FiLinkedin size={20} />
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2024 FarmDirect. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link href="/terms" className="hover:text-white transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
