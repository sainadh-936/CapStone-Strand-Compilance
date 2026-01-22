import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Strand Logistics | Sample Collection System',
  description: 'Streamline diagnostic sample collection documentation',
  robots: 'noindex, nofollow', // Prevent search engine indexing
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="flex justify-center items-center">
          <div className="w-full max-w-7xl">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
