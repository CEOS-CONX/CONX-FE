'use client';

import { useState } from 'react';
import IconStar from '@/assets/icons/icon_star.svg';
import Tag from '@/components/common/Tag/Tag';
import { CTAButton } from '@/components/common/CTAButton';

const RATING_CATEGORIES = [
  {
    key: 'completeness',
    label: '결과물 완성도',
    description: '최종 제출물이 요청한 기준과 목적에 맞게 완성되었나요?',
  },
  {
    key: 'ability',
    label: '실행력',
    description: '일정에 맞춰 필요한 작업을 주도적으로 진행했나요?',
  },
  {
    key: 'communication',
    label: '커뮤니케이션',
    description: '피드백 확인, 답변 속도, 협업 과정의 소통이 원활했나요?',
  },
  {
    key: 'schedule',
    label: '일정 준수',
    description: '마감일과 주요 진행 일정을 잘 지켰나요?',
  },
  {
    key: 'reCooperation',
    label: '재협업 의향',
    description: '향후 비슷한 프로젝트에서 다시 함께하고 싶으신가요?',
  },
] as const;

const SCORE_LABELS: Record<number, string> = {
  1: '개선이 필요해요',
  2: '아쉬워요',
  3: '보통이에요',
  4: '만족스러워요',
  5: '매우 우수해요',
};

type Ratings = Record<string, number>;

interface CrewReviewModalProps {
  onSubmit: (ratings: Ratings) => void;
}

function StarRating({ value, onChange }: { value: number; onChange: (score: number) => void }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="cursor-pointer p-1.5"
          >
            <IconStar
              className={`size-6 ${star <= value ? 'text-conx-star' : 'text-conx-gray-150'}`}
            />
          </button>
        ))}
      </div>
      {value > 0 && <Tag type="yellow" size="sm" label={SCORE_LABELS[value]} />}
    </div>
  );
}

export default function CrewReviewModal({ onSubmit }: CrewReviewModalProps) {
  const [ratings, setRatings] = useState<Ratings>({});

  const allFilled = RATING_CATEGORIES.every((cat) => ratings[cat.key] > 0);

  function handleRate(key: string, score: number) {
    setRatings((prev) => ({ ...prev, [key]: score }));
  }

  function handleSubmit() {
    if (!allFilled) return;
    onSubmit(ratings);
  }

  return (
    <div className="bg-conx-opacity-gray-30 z-conx-modal-backdrop fixed inset-0 flex items-center justify-center">
      <div className="z-conx-modal drop-shadow-conx-drop-gray-15 flex w-114.5 flex-col items-end gap-10 rounded-md bg-white px-6 py-5">
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-kor-heading-3-bold text-conx-common-black">
              이번 협업은 어땠나요?
            </h2>
            <p className="text-kor-label-1-medium text-conx-gray-450">
              프로젝트 완료를 위해 모든 평가 항목의 별점을 선택해 주세요.
            </p>
          </div>

          <div className="bg-conx-gray-100 h-px w-full" />

          <div className="flex flex-col gap-8">
            {RATING_CATEGORIES.map((cat) => (
              <div key={cat.key} className="flex flex-col gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-kor-body-1-semibold text-conx-common-black">
                    {cat.label}
                  </span>
                  <span className="text-kor-label-1-medium text-conx-gray-400">
                    {cat.description}
                  </span>
                </div>
                <StarRating
                  value={ratings[cat.key] ?? 0}
                  onChange={(score) => handleRate(cat.key, score)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-54.25">
          <CTAButton variant="secondary" disabled={!allFilled} onClick={handleSubmit}>
            완료
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
