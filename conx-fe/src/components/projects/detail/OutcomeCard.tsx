function Divider() {
  return (
    <span aria-hidden className="text-conx-gray-200">
      |
    </span>
  );
}

interface OutcomeCardProps {
  platform: string; // 플랫폼명
  contentType: string; // 콘텐츠 유형
  count: string; // 0개
  submission: string; // 최종 제출 결과물
  /** 아랫줄(입력 완료 정보 등) — 없으면 윗줄만 */
  info?: string;
}

// Card_Outcome: gray-50 배경 + radius 6px + padding 16px, 윗줄(요약, KOR semibold)·아랫줄(정보, KOR medium)
export default function OutcomeCard({
  platform,
  contentType,
  count,
  submission,
  info,
}: OutcomeCardProps) {
  return (
    <div className="bg-conx-gray-50 flex w-full flex-col items-start justify-center gap-3 rounded-md p-4">
      <p className="text-kor-body-1-semibold text-conx-gray-550 flex flex-wrap items-center gap-2.5">
        <span>{platform}</span>
        <Divider />
        <span>{contentType}</span>
        <Divider />
        <span>{count}</span>
        <Divider />
        <span>{submission}</span>
      </p>
      {info && <p className="text-kor-body-1-medium text-conx-gray-550">{info}</p>}
    </div>
  );
}
