import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Amexan – Connected Care That Continues',
  description:
    'Amexan delivers secure telemedicine, chronic care management, and intelligent health insights through one continuous healthcare platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable}`}
    >
      <body className="font-sans overflow-x-hidden antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
