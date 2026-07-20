'use client';

import IconStar from '@/assets/icons/icon_star_fill.svg';
import { TextLineButton } from '@/components/common/TextLineButton';

// 평점 — icon_star_fill + 점수(Gray-600 · ENG Label1 Medium)
function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1">
      <IconStar className="h-[18px] w-[18px]" />
      <span className="text-eng-label-1-medium text-conx-gray-600">{rating.toFixed(1)}</span>
    </span>
  );
}

interface ProjectDetailRowProps {
  /** 작업 유형 값 (라벨 아래) */
  workType: string;
  rating: number;
  onDetailClick?: () => void;
  /** 패딩 — Table_Row_Open 상세: px-[50px] / Table_ProjectHistory: px-9(36) */
  className?: string;
}

// 작업 유형 / 평점 / 작업 상세페이지 바로가기 — Table_Row_Open 펼침부 & Table_ProjectHistory 공용
// TODO(레이아웃): 컬럼 폭·정렬은 추정(justify-between) — 정확한 값 오면 반영
export default function ProjectDetailRow({
  workType,
  rating,
  onDetailClick,
  className = 'px-[50px] py-4',
}: ProjectDetailRowProps) {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      {/* 작업 유형 */}
      <div className="flex flex-col gap-2">
        <span className="text-kor-label-1-medium text-conx-gray-350">작업 유형</span>
        <span className="text-kor-label-1-medium text-conx-common-black">{workType}</span>
      </div>

      {/* 평점 */}
      <div className="flex flex-col gap-2">
        <span className="text-kor-label-1-medium text-conx-gray-350">평점</span>
        <StarRating rating={rating} />
      </div>

      {/* 작업 상세페이지 바로가기 */}
      <TextLineButton onClick={onDetailClick}>작업 상세페이지 바로가기</TextLineButton>
    </div>
  );
}
