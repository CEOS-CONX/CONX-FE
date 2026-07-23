'use client';

import { useState } from 'react';
import IconArrowUp from '@/assets/icons/icon_arrowUp_stroke.svg';
import IconCheckboxChecked from '@/assets/icons/icon_checkbox_checked.svg';
import IconCheckboxDefault from '@/assets/icons/icon_checkbox_default.svg';
import ProjectDetailRow from './ProjectDetailRow';

// 헤더행과 행이 같은 컬럼 폭을 공유해야 정렬됨 (literal이라 Tailwind JIT가 스캔함)
export const PROJECT_COLS = {
  checkbox: 'w-[22px]',
  brand: 'w-[120px]',
  period: 'w-[190px]',
  chevron: 'w-[18px]',
} as const;

interface ProjectRowProps {
  name: string;
  brand: string;
  /** "2000.00.00~2000.00.00" */
  period: string;
  workType: string;
  rating: number;
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  /** 미체크 + 이미 최대 선택 → 체크 비활성 */
  disabled?: boolean;
  onDetailClick?: () => void;
  /** 기본 펼침 여부 */
  defaultOpen?: boolean;
}

// Table_Row_Open — 대표 프로젝트 선택 테이블 행 (체크박스 + 컬럼 + 펼침 상세)
export default function ProjectRow({
  name,
  brand,
  period,
  workType,
  rating,
  checked = false,
  onCheck,
  disabled = false,
  onDetailClick,
  defaultOpen = false,
}: ProjectRowProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-conx-gray-100 border-b">
      {/* 상단 행 */}
      <div className="flex items-center py-4 pr-[11px] pl-[14px]">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-label="프로젝트 선택"
          disabled={disabled}
          onClick={() => onCheck?.(!checked)}
          className={`${PROJECT_COLS.checkbox} shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40`}
        >
          {checked ? (
            <IconCheckboxChecked className="h-[22px] w-[22px]" />
          ) : (
            <IconCheckboxDefault className="h-[22px] w-[22px]" />
          )}
        </button>
        <span className="text-kor-body-1-semibold text-conx-common-black ml-9 min-w-0 flex-1 truncate">
          {name}
        </span>
        <span
          className={`text-kor-body-1-semibold text-conx-common-black ml-9 shrink-0 truncate ${PROJECT_COLS.brand}`}
        >
          {brand}
        </span>
        <span
          className={`text-kor-label-1-semibold text-conx-gray-450 ml-9 shrink-0 ${PROJECT_COLS.period}`}
        >
          {period}
        </span>
        <button
          type="button"
          aria-label={open ? '접기' : '펼치기'}
          onClick={() => setOpen((v) => !v)}
          className={`ml-9 shrink-0 cursor-pointer ${PROJECT_COLS.chevron}`}
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
