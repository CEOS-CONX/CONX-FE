'use client';

import Link from 'next/link';
import { useState } from 'react';
import IconArrowLeft from '@/assets/icons/icon_arrowLeft_stroke.svg';
import IconArrowRight from '@/assets/icons/icon_arrowRight_stroke.svg';
import { CTAButton } from '@/components/common/CTAButton';

interface ApplyPanelProps {
  /** 헤더 < 클릭 → 지원하기 버튼 상태로 복귀 */
  onBack: () => void;
}

// 지원하기 패널 — CTA(지원하기) 자리에 교체되어 뜸.
export default function ApplyPanel({ onBack }: ApplyPanelProps) {
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

        {/* gap 12 → 프로필 카드. 클릭 시 해당 크루 상세로 이동 */}
        {/* TODO: 실제 크루 id로 경로 연결 (예: /crews/[crewId]) */}
        <Link
          href="/crews/1"
          className="border-conx-gray-100 hover:bg-conx-gray-50 active:bg-conx-gray-150 mt-3 flex items-center gap-4 rounded-md border py-4 pr-2 pl-4 text-left transition-colors"
        >
          <div className="min-w-0 flex-1">
            <p className="text-kor-body-1-semibold text-conx-common-black">프로필명</p>
            <dl className="text-kor-label-1-medium mt-2 flex flex-col gap-1">
              <div className="flex gap-3">
                <dt className="text-conx-gray-350 w-14 shrink-0">크루명</dt>
                <dd className="text-conx-common-black">CEOS 세오스</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-conx-gray-350 w-14 shrink-0">대표자명</dt>
                <dd className="text-conx-common-black">김대표</dd>
              </div>
            </dl>
            <p className="border-conx-gray-100 text-kor-caption-1-medium text-conx-gray-350 mt-3 border-t pt-3">
              2000.00.00 <span className="text-conx-gray-200 mx-1">|</span> 작성 완료
            </p>
          </div>
          <IconArrowRight className="h-[18px] w-[18px] shrink-0" />
        </Link>

        {/* gap 32 → 지원 동기 */}
        <div className="mt-8">
          <h3 className="text-kor-heading-3-semibold text-conx-common-black">지원 동기</h3>
          <p className="text-kor-label-1-medium text-conx-gray-450 mt-1">
            유사한 협업 경험이나 크루만의 강점을 작성해 주세요
          </p>
        </div>

        {/* gap 12 → 작성박스 */}
        <textarea
          value={motive}
          onChange={(e) => setMotive(e.target.value)}
          placeholder="내용을 입력해주세요"
          className="bg-conx-gray-50 text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 hover:bg-conx-gray-100 focus:bg-conx-gray-50 focus:border-conx-primary-300 [&::-webkit-scrollbar-thumb]:bg-conx-gray-100 [&::-webkit-scrollbar-thumb:hover]:bg-conx-gray-150 [&::-webkit-scrollbar-thumb:active]:bg-conx-gray-200 mt-3 h-[320px] w-full resize-none [scrollbar-width:thin] [scrollbar-color:#EBEFF5_transparent] rounded-md border border-transparent py-4 pr-2 pl-4 transition-colors outline-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
        />

        {/* gap 32 → 제출. 내용 있으면 활성화, 클릭 시 약관 팝업 오픈 */}
        <CTAButton disabled={!hasContent} onClick={() => setShowTerms(true)} className="mt-8">
          지원서 제출
        </CTAButton>
      </div>

      {/* 약관 동의 팝업 — 추후 제작 예정. 지금은 흐름 확인용 임시 stub.
          실제 팝업에서 동의 + 확인(내부 버튼) 후에만 최종 제출되도록 연결할 것 */}
      {showTerms && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="약관 동의"
          onClick={() => setShowTerms(false)}
          className="bg-conx-opacity-gray-30 z-conx-modal fixed inset-0 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-conx-common-white flex w-[320px] flex-col gap-4 rounded-md p-6 text-center"
          >
            <p className="text-kor-heading-3-semibold text-conx-common-black">
              약관 동의 팝업 (추후 제작)
            </p>
            {/* TODO: 실제 최종 제출 로직 연결 (동의 + 확인 후에만 제출) */}
            <CTAButton onClick={() => setShowTerms(false)}>동의하고 제출하기</CTAButton>
          </div>
        </div>
      )}
    </div>
  );
}
