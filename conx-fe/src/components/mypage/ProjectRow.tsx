'use client';

import { useState } from 'react';
import IconArrowUp from '@/assets/icons/icon_arrowUp_stroke.svg';
import ProjectDetailRow from './ProjectDetailRow';

interface ProjectRowProps {
  name: string;
  brand: string;
  /** "2000.00.00~2000.00.00" */
  period: string;
  workType: string;
  rating: number;
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  onDetailClick?: () => void;
  /** 기본 펼침 여부 */
  defaultOpen?: boolean;
}

// Table_Row_Open — 대표 프로젝트 선택 테이블 행 (체크박스 + 컬럼 + 펼침 상세)
// TODO(레이아웃): 컬럼 폭·상단행 세로패딩은 추정 — 정확한 값 오면 반영
export default function ProjectRow({
  name,
  brand,
  period,
  workType,
  rating,
  checked = false,
  onCheck,
  onDetailClick,
  defaultOpen = false,
}: ProjectRowProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-conx-gray-100 border-b">
      {/* 상단 행 — 좌패딩 14 / 우패딩 11 */}
      <div className="flex items-center py-4 pr-[11px] pl-[14px]">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheck?.(e.target.checked)}
          className="border-conx-gray-150 bg-conx-common-white accent-conx-primary-500 h-[18px] w-[18px] shrink-0 appearance-none rounded-[4px] border"
        />
        <span className="text-kor-body-1-semibold text-conx-common-black ml-9 flex-1">{name}</span>
        <span className="text-kor-body-1-semibold text-conx-common-black">{brand}</span>
        <span className="text-kor-label-1-semibold text-conx-gray-450 ml-9">{period}</span>
        <button
          type="button"
          aria-label={open ? '접기' : '펼치기'}
          onClick={() => setOpen((v) => !v)}
          className="ml-9 shrink-0 cursor-pointer"
        >
          <IconArrowUp
            className={`[&_path]:stroke-conx-gray-300 h-[18px] w-[18px] transition-transform ${open ? '' : 'rotate-180'}`}
          />
        </button>
      </div>

      {/* 펼침 상세 */}
      {open && (
        <ProjectDetailRow workType={workType} rating={rating} onDetailClick={onDetailClick} />
      )}
    </div>
  );
}
