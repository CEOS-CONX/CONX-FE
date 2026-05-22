import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import './globals.css';

const suit = localFont({
  src: '../assets/fonts/SUIT-Variable.woff2',
  variable: '--font-suit-face',
  weight: '100 900',
  display: 'swap',
});

const plusJakartaSans = localFont({
  src: '../assets/fonts/PlusJakartaSans-Variable.woff2',
  variable: '--font-jakarta-face',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CONX',
  description: 'CONX',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${suit.variable} ${plusJakartaSans.variable} h-full antialiased`}>
      <body className="font-suit flex min-h-full flex-col">
        {/* 임시조치 - navbar 로그인 상태 여기서 관리하기 */}
        <Navbar isLoggedIn={true} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
