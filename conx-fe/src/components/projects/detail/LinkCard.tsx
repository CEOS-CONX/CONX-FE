import IconLink from '@/assets/icons/icon_link.svg';

interface LinkCardProps {
  /** 첫줄 링크명 */
  name: string;
  /** 둘째줄 URL */
  url: string;
  /** 셋째줄(입력 완료 정보 등) — 없으면 두 줄만 */
  info?: string;
}

// Card_Link: gray-50 배경(hover gray-100 / active gray-150) + radius 6 + p-4, 3줄(링크명·URL·정보)
export default function LinkCard({ name, url, info }: LinkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-conx-gray-50 hover:bg-conx-gray-100 active:bg-conx-gray-150 flex w-full flex-col items-start justify-center gap-3 rounded-md p-4 transition-colors"
    >
      <span className="text-kor-body-1-semibold text-conx-gray-550 flex items-center gap-2">
        {/* icon_link: stroke #121212 박혀 있어 회색으로 덮어씀 */}
        <IconLink className="[&_path]:stroke-conx-gray-450 h-5 w-5 shrink-0" />
        {name}
      </span>
      {/* URL·정보는 링크명과 정렬(아이콘 20 + gap 8 = pl-7) */}
      <span className="text-eng-body-1-medium text-conx-gray-550 pl-7">{url}</span>
      {info && <span className="text-kor-body-1-medium text-conx-gray-550 pl-7">{info}</span>}
    </a>
  );
}
