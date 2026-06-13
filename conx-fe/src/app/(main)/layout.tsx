import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 임시조치 - navbar 로그인 상태 여기서 관리하기 */}
      <Navbar isLoggedIn={true} />
      {children}
      <Footer />
    </>
  );
}
