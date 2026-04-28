import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'FarmDirect - Direct Market Access for Farmers',
  description:
    'Connect directly with farmers and buyers. Fresh produce at fair prices without middlemen.',
  keywords: 'farmers, agriculture, marketplace, fresh produce, organic, direct sales',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
