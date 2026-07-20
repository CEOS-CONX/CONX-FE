'use client';

import IconEdit from '@/assets/icons/icon_edit.svg';
import IconTrash from '@/assets/icons/icon_trash.svg';
import { useFileUpload } from '@/hooks/useFileUpload';

interface ProfileImageProps {
  src?: string;
  alt?: string;
  /** 파일 선택 시 */
  onSelect?: (file: File) => void;
  onRemove?: () => void;
  /** 클릭 동작 override (없으면 파일 선택 다이얼로그) */
  onEdit?: () => void;
}

export default function ProfileImage({
  src,
  alt = '프로필 이미지',
  onSelect,
  onRemove,
  onEdit,
}: ProfileImageProps) {
  const { inputRef, open, onInputChange } = useFileUpload(onSelect);
  const filled = !!src;
  // 오버레이 bg는 버튼 자체 :hover/:active + ::after (active가 hover를 안정적으로 덮음)
  const overlay = filled
    ? "after:pointer-events-none after:absolute after:inset-0 after:rounded-md after:transition-colors after:content-[''] hover:after:bg-conx-opacity-gray-50 active:after:bg-conx-opacity-gray-85"
    : "after:pointer-events-none after:absolute after:inset-0 after:rounded-md after:transition-colors after:content-[''] hover:after:bg-conx-opacity-gray-30 active:after:bg-conx-opacity-gray-50";

  return (
    <div className="group flex items-center gap-1.5">
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onInputChange} />
      {/* 이미지 버튼 (클릭 → 파일 선택 / onEdit override) */}
      <button
        type="button"
        aria-label={filled ? '이미지 변경' : '이미지 추가'}
        onClick={onEdit ?? open}
        className={`group/img relative flex h-21 w-21 shrink-0 items-center justify-center overflow-hidden rounded-md ${overlay}`}
      >
        {filled ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          // TODO: 실제 기본 이미지로 교체 (지금은 placeholder)
          <span className="text-kor-label-1-medium bg-conx-gray-100 text-conx-gray-350 flex h-full w-full items-center justify-center text-center">
            기본 이미지
            <br />
            (추가예정🥹)
          </span>
        )}

        {/* edit 아이콘 — hover/active 시 노출(z-10으로 오버레이 위) */}
        <IconEdit className="pointer-events-none absolute z-10 h-8 w-8 opacity-0 transition-opacity group-hover/img:opacity-100 [&_path]:stroke-white" />
      </button>

      {/* trash 버튼 — filled일 때만, hover(또는 포커스)로 노출 */}
      {filled && (
        <button
          type="button"
          aria-label="이미지 삭제"
          onClick={onRemove}
          className="bg-conx-gray-100 hover:bg-conx-gray-150 hidden shrink-0 items-center justify-center rounded-md p-1.5 transition-colors group-focus-within:flex group-hover:flex"
        >
          <IconTrash className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
