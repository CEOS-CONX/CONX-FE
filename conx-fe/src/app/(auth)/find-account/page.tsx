import type { Metadata } from 'next';
import FindAccountForm from '@/components/login/FindAccountForm';

export const metadata: Metadata = {
  title: '계정 찾기',
};

export default function FindAccountPage() {
  return <FindAccountForm />;
}
