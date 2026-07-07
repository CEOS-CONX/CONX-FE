import IconArrowRight from '@/assets/icons/icon_arrowRight_stroke.svg';
import IconFile from '@/assets/icons/icon_file.svg';

interface UploadCardProps {
  /** 파일명[확장자명, 용량] */
  name: string;
  /** 아랫줄(입력 완료 정보 등) — 있으면 subtext 상태 */
  info?: string;
  onPreview?: () => void; // TODO: 미리보기 (나중에)
  onDownload?: () => void; // TODO: 다운로드 (나중에)
}

// 미리보기 / 다운로드 — text black semibold + chevron, padding 8/12, gap 4
// default·active 동일, hover만 회색 배경(opacity-gray-6, 코드베이스 텍스트+아이콘 버튼 표준)
function ActionButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-kor-body-1-semibold text-conx-common-black hover:bg-conx-opacity-gray-6 flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-center transition-colors active:bg-transparent"
    >
      {label}
      <IconArrowRight className="h-[18px] w-[18px]" />
    </button>
  );
}

// Card_Upload: 파일 카드. subtext 유무로 padding 분기(8/16/16/16 vs 26/16)
export default function UploadCard({ name, info, onPreview, onDownload }: UploadCardProps) {
  const subtext = !!info;
  return (
    <div
      className={`bg-conx-gray-50 flex h-[92px] w-full flex-col justify-center gap-1 rounded-md ${
        subtext ? 'px-4 pt-2 pb-4' : 'px-4 py-[26px]'
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <span className="text-kor-body-1-semibold text-conx-gray-550 flex items-center gap-2">
          {/* icon_file: stroke #121212 박혀 있어 회색으로 덮어씀 */}
          <IconFile className="[&_path]:stroke-conx-gray-450 h-6 w-5 shrink-0" />
          {name}
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <ActionButton label="미리보기" onClick={onPreview} />
          <ActionButton label="다운로드" onClick={onDownload} />
        </span>
      </div>

      {/* 아랫줄은 파일명과 정렬(아이콘 폭 20 + gap 8 = pl-7) */}
      {subtext && <p className="text-kor-body-1-medium text-conx-gray-550 pl-7">{info}</p>}
    </div>
  );
}
