'use client';

import IconEdit from '@/assets/icons/icon_edit.svg';
import IconImage from '@/assets/icons/icon_image.svg';
import IconTrash from '@/assets/icons/icon_trash.svg';
import { useFileUpload } from '@/hooks/useFileUpload';

interface ImageCardProps {
  /** 있으면 filled(실제 이미지 표시) */
  src?: string;
  alt?: string;
  /** 빈칸 문구 (기본 "이미지 첨부") */
  placeholder?: string;
  onSelect?: (file: File) => void;
  onRemove?: () => void;
  /** 편집 버튼 클릭 (없으면 파일 다시 선택) */
  onEdit?: () => void;
  error?: boolean;
  accept?: string;
  /** 빈칸 클릭 동작 override (예: 등록 모달 열기). 없으면 파일 선택 */
  onEmptyClick?: () => void;
  /** 빈칸 아이콘 override (기본 icon_image). 등록카드는 plus 등 */
  icon?: React.ReactNode;
  className?: string;
}

// Img_Card — 이미지 슬롯 1칸. 456×273, 보더 상태는 TextFieldUpload와 동일
// 빈칸: icon_image + "이미지 첨부"(gray-300) / 채움: 실제 이미지 + hover 우상단 수정·삭제
export default function ImageCard({
  src,
  alt = '이미지',
  placeholder = '이미지 첨부',
  onSelect,
  onRemove,
  onEdit,
  error,
  accept = 'image/*',
  onEmptyClick,
  icon = <IconImage className="h-6 w-6" />,
  className = 'h-[273px] w-[456px]',
}: ImageCardProps) {
  const { inputRef, dragOver, open, onInputChange, dragProps } = useFileUpload(onSelect);
  const filled = !!src;

  // 보더/배경 (우선순위: drag > error > filled > 기본)
  const boxState = dragOver
    ? 'border-2 border-dashed border-conx-primary-300 bg-conx-gray-50'
    : error
      ? 'border border-conx-red-500 bg-conx-common-white'
      : filled
        ? 'border border-conx-gray-400'
        : 'border border-conx-gray-150 bg-conx-common-white hover:border-conx-gray-300 focus:border-conx-primary-300';

  // 사이즈는 className으로 (기본 456×273, 모달·업로더에선 override)
  const base = `relative flex flex-col items-center justify-center gap-2.5 overflow-hidden rounded-md transition-colors ${boxState} ${className}`;

  return (
    <>
      <input ref={inputRef} type="file" accept={accept} hidden onChange={onInputChange} />

      {filled ? (
        <div className={`group ${base}`} {...dragProps}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="h-full w-full object-cover" />
          {/* hover 시 우상단 수정/삭제 (세로 배치) */}
          <div className="absolute top-3 right-3 hidden flex-col gap-2 group-hover:flex">
            <button
              type="button"
              aria-label="이미지 삭제"
              onClick={onRemove}
              className="bg-conx-gray-100 flex items-center justify-center rounded-md p-1.5"
            >
              <IconTrash className="h-[22px] w-[22px]" />
            </button>
            <button
              type="button"
              aria-label="이미지 변경"
              onClick={onEdit ?? open}
              className="bg-conx-gray-100 flex items-center justify-center rounded-md p-1.5"
            >
              <IconEdit className="h-[22px] w-[22px]" />
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={onEmptyClick ?? open} className={base} {...dragProps}>
          {/* icon(24) + 텍스트, 갭 4px */}
          <span className="flex flex-col items-center gap-1">
            {icon}
            <span className="text-kor-body-1-semibold text-conx-gray-300">{placeholder}</span>
          </span>
        </button>
      )}
    </>
  );
}
