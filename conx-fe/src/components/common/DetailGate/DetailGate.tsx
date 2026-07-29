'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CTAButton from '@/components/common/CTAButton/CTAButton';

interface DetailGateProps {
  title: string;
  subtitle?: React.ReactNode;
  /** 비로그인 버전만 true */
  showAuthActions?: boolean;
}

// 상세페이지 콘텐츠를 위에서 덮어 가리는 게이트(오버레이).
//  - 푸터 바로 위에서부터 1075px, 가로 full
//  - 부모는 relative, 이 컴포넌트가 그 안 최하단 자식이어야 함 (bottom-0 기준 = 부모 하단 = 푸터 바로 위)
//  - 아이콘 + 타이틀은 항상, 부제·회원가입 액션은 옵션 → 기업 제한 버전에서 아이콘+타이틀만 재사용
export default function DetailGate({ title, subtitle, showAuthActions }: DetailGateProps) {
  const router = useRouter();
  return (
    <div className="absolute inset-x-0 bottom-0 flex h-[1075px] flex-col">
      <div className="bg-conx-gradient-white-bottom h-[400px] shrink-0" />

      <div className="bg-conx-common-white flex flex-1 flex-col items-center px-6 pt-[100px]">
        <Image src="/images/image_profileDefaultC.png" alt="CONX" width={80} height={80} priority />

        <h2 className="text-kor-title-1-bold text-conx-common-black mt-6 text-center">{title}</h2>

        {subtitle && (
          <p className="text-kor-heading-3-semibold text-conx-gray-500 mt-4 max-w-[460px] text-center">
            {subtitle}
          </p>
        )}

        {showAuthActions && (
          <>
            <div className="mt-10 w-[360px]">
              <CTAButton href="/signup" variant="secondary">
                회원가입하고 상세정보 보기
              </CTAButton>
            </div>
            <p className="text-kor-label-1-medium text-conx-gray-450 mt-4 text-center">
              이미 가입하셨나요?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="cursor-pointer underline underline-offset-2"
              >
                로그인하기
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
