import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="ko" className="h-full antialiased">
      <body className="font-suit flex min-h-full flex-col">{children}</body>
    </html>
  );
}
