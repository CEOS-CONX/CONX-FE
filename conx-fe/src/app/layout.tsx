import type { Metadata } from 'next';
import localFont from 'next/font/local';
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
      <body className="font-suit flex min-h-full flex-col">{children}</body>
    </html>
  );
}
