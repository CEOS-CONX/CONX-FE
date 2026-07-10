import Link from 'next/link';
import IconArrowRight from '@/assets/icons/icon_arrowRight_stroke.svg';

interface CrewProfileCardProps {
  className?: string;
}

// 크루 프로필 카드 — 지원하기 패널 / 제출 지원서(읽기전용) 공용. 클릭 시 크루 상세로 이동
// TODO: 실제 크루 데이터 + id 라우트 연결 (예: /crews/[crewId])
export default function CrewProfileCard({ className }: CrewProfileCardProps) {
  return (
    <Link
      href="/crews/1"
      className={`border-conx-gray-100 hover:bg-conx-gray-50 active:bg-conx-gray-150 flex items-center gap-4 rounded-md border py-4 pr-2 pl-4 text-left transition-colors ${className ?? ''}`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-kor-body-1-semibold text-conx-common-black">프로필명</p>
        <dl className="text-kor-label-1-medium mt-2 flex flex-col gap-1">
          <div className="flex gap-3">
            <dt className="text-conx-gray-350 w-14 shrink-0">크루명</dt>
            <dd className="text-conx-common-black">CEOS 세오스</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-conx-gray-350 w-14 shrink-0">대표자명</dt>
            <dd className="text-conx-common-black">김대표</dd>
          </div>
        </dl>
        <p className="border-conx-gray-100 text-kor-caption-1-medium text-conx-gray-350 mt-3 border-t pt-3">
          2000.00.00 <span className="text-conx-gray-200 mx-1">|</span> 작성 완료
        </p>
      </div>
      <IconArrowRight className="h-[18px] w-[18px] shrink-0" />
    </Link>
  );
}
