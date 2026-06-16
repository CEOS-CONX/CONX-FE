'use client';

import { useRouter } from 'next/navigation';
import Modal from './Modal';

interface LoginRequiredModalProps {
  onClose: () => void;
}

export default function LoginRequiredModal({ onClose }: LoginRequiredModalProps) {
  const router = useRouter();

  return (
    <Modal
      title="로그인이 필요한 서비스입니다"
      subtitle={
        <>
          커넥스가 처음이신가요?
          <br />
          로그인 하고 커넥스를 이용해보세요!
        </>
      }
      primaryLabel="로그인하러 가기"
      onPrimaryClick={() => router.push('/login')}
      onClose={onClose}
    />
  );
}
