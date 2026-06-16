import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-h-431.75">{children}</div>
      <Footer />
    </>
  );
}
