interface EventCardProps {
  /** 윗줄 라벨 (예: 크루 모집 마감일) */
  label: string;
  /** 아랫줄 날짜 (예: 2026.05.03) */
  date: string;
}

// Card_Event: gray-50 배경 + radius 6px + padding 12/16, 라벨(KOR)·날짜(ENG) 세로 배치
export default function EventCard({ label, date }: EventCardProps) {
  return (
    <div className="bg-conx-gray-50 inline-flex flex-col items-start gap-1 rounded-md px-4 py-3">
      <p className="text-kor-body-1-semibold text-conx-gray-550">{label}</p>
      <p className="text-eng-body-1-medium text-conx-gray-550">{date}</p>
    </div>
  );
}
