'use client';

import { useState } from 'react';
import IconArrowLeft from '@/assets/icons/icon_arrowLeft_stroke.svg';
import { CTAButton } from '@/components/common/CTAButton';
import ApplyTermsModal from './ApplyTermsModal';
import CrewProfileCard from './CrewProfileCard';

interface ApplyPanelProps {
  onBack: () => void;
  onSubmitted: (motive: string) => void;
}

// 지원하기 패널
export default function ApplyPanel({ onBack, onSubmitted }: ApplyPanelProps) {
  const [motive, setMotive] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const hasContent = motive.trim().length > 0; // type·filled → 제출 버튼 활성

  return (
    <div className="border-conx-gray-150 bg-conx-common-white w-full overflow-hidden rounded-md border">
      {/* 헤더: < 지원하기 */}
      <div className="border-conx-gray-100 relative flex items-center justify-center border-b px-5 py-4">
        <button
          type="button"
          aria-label="뒤로"
          onClick={onBack}
          className="absolute left-5 flex cursor-pointer items-center justify-center"
        >
          <IconArrowLeft className="[&_path]:stroke-conx-common-black h-5 w-5" />
        </button>
        <span className="text-kor-heading-2-bold text-conx-common-black">지원하기</span>
      </div>

      {/* 본문 */}
      <div className="flex flex-col px-5 pt-6 pb-5">
        {/* 크루 프로필 */}
        <div>
          <h3 className="text-kor-heading-3-semibold text-conx-common-black">크루 프로필</h3>
          <p className="text-kor-label-1-medium text-conx-gray-450 mt-1">
            프로필이 지원서와 함께 기업 담당자에게 전달돼요
          </p>
        </div>

        {/*프로필 카드 */}
        <CrewProfileCard className="mt-3" />

        {/* 지원 동기 */}
        <div className="mt-8">
          <h3 className="text-kor-heading-3-semibold text-conx-common-black">지원 동기</h3>
          <p className="text-kor-label-1-medium text-conx-gray-450 mt-1">
            유사한 협업 경험이나 크루만의 강점을 작성해 주세요
          </p>
        </div>

        {/* 작성박스 */}
        <textarea
          value={motive}
          onChange={(e) => setMotive(e.target.value)}
          placeholder="내용을 입력해주세요"
          className="bg-conx-gray-50 text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 hover:bg-conx-gray-100 focus:bg-conx-gray-50 focus:border-conx-primary-300 [&::-webkit-scrollbar-thumb]:bg-conx-gray-100 [&::-webkit-scrollbar-thumb:hover]:bg-conx-gray-150 [&::-webkit-scrollbar-thumb:active]:bg-conx-gray-200 mt-3 h-[320px] w-full resize-none [scrollbar-width:thin] [scrollbar-color:#EBEFF5_transparent] rounded-md border border-transparent py-4 pr-2 pl-4 transition-colors outline-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
        />

        {/* 제출. 내용 있으면 활성화, 클릭 시 약관 팝업 오픈 */}
        <CTAButton disabled={!hasContent} onClick={() => setShowTerms(true)} className="mt-8">
          지원서 제출
        </CTAButton>
      </div>

      {/* 약관 동의 팝업 — 필수 항목 모두 동의 후 최종 제출 */}
      {showTerms && (
        <ApplyTermsModal
          onClose={() => setShowTerms(false)}
          onSubmit={() => {
            // TODO: 실제 지원서 제출 API 연결. 지금은 입력값을 부모로 올려 완료 상태 처리
            setShowTerms(false);
            onSubmitted(motive);
          }}
        />
      )}
    </div>
  );
}
