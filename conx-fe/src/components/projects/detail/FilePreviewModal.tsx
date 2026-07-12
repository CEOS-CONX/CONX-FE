'use client';

import IconClose from '@/assets/icons/icon_delete.svg';
import { Button } from '@/components/common/Button';
import { useDialog } from '@/hooks/useDialog';

interface FilePreviewModalProps {
  fileName: string;
  onClose: () => void;
  /** 다운로드 버튼 노출 여부 (포트폴리오 등 다운로드 불가 자료는 false) */
  downloadable?: boolean;
}

// placeholder 페이지들 — 실제로는 이미지 URL 배열.
// 미리보기 자료를 어떻게 가공/전달할지(백/프론트)는 미정이지만, 최종적으로 이미지로 렌더할 예정.
// 각 페이지 width는 938px 고정, 높이는 파일마다 가변 → 지금은 placeholder 높이.
const PLACEHOLDER_PAGES = [520, 320, 360, 480];

export default function FilePreviewModal({
  fileName,
  onClose,
  downloadable = true,
}: FilePreviewModalProps) {
  const dialogRef = useDialog(onClose); // Esc·스크롤 잠금·포커스 트랩/복귀

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${fileName} 미리보기`}
      className="bg-conx-opacity-gray-85 z-conx-modal fixed inset-0 flex flex-col"
    >
      {/* ▼ 상단 네브바 (height 72, 좌우 90) */}
      <div className="flex h-[72px] shrink-0 items-center justify-between px-[90px]">
        {/* 왼쪽: X(22px) + 파일명 */}
        <div className="flex min-w-0 items-center gap-7">
          <button
            type="button"
            aria-label="미리보기 닫기"
            onClick={onClose}
            className="shrink-0 cursor-pointer"
          >
            <IconClose className="[&_path]:stroke-conx-common-white h-[22px] w-[22px]" />
          </button>
          <span className="text-kor-heading-2-semibold text-conx-common-white truncate">
            {fileName}
          </span>
        </div>

        {/* 오른쪽: 페이지 인디케이터 + 다운로드 */}
        <div className="flex shrink-0 items-center gap-10">
          {/* TODO: 실제 페이지 추적 (지금은 0/0 placeholder) */}
          <div className="flex items-center gap-2.5">
            <span className="text-kor-label-1-medium text-conx-gray-300">페이지</span>
            <div className="border-conx-gray-300 bg-conx-opacity-gray-30 flex h-8 w-8 items-center justify-center rounded-md border">
              <span className="text-kor-heading-2-semibold text-conx-common-white">0</span>
            </div>
            <span className="text-conx-gray-300">|</span>
            <span className="text-kor-heading-2-semibold text-conx-common-white">0</span>
          </div>
          {downloadable && <Button variant="secondary">다운로드</Button>}
        </div>
      </div>

      {/* ▼ 본문: 왼쪽 썸네일 사이드바 + 가운데 미리보기(스크롤) */}
      <div className="flex flex-1 overflow-hidden">
        {/* 썸네일 (placeholder) */}
        <div className="scrollbar-hide flex w-[150px] shrink-0 flex-col items-center gap-4 overflow-y-auto py-5">
          {PLACEHOLDER_PAGES.map((_, i) => (
            <div key={i} className="aspect-[3/4] w-[110px] shrink-0 rounded-sm bg-white" />
          ))}
        </div>

        {/* 미리보기: 각 페이지 width 938 고정, 세로 스크롤 */}
        <div className="scrollbar-hide flex flex-1 flex-col items-center gap-4 overflow-y-auto py-6">
          {PLACEHOLDER_PAGES.map((h, i) => (
            <div key={i} className="w-[938px] shrink-0 rounded-sm bg-white" style={{ height: h }} />
          ))}
        </div>
      </div>
    </div>
  );
}
