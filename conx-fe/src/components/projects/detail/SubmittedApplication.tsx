import CrewProfileCard from './CrewProfileCard';

interface SubmittedApplicationProps {
  /** 제출한 지원 동기 */
  motive: string;
}

// 제출 완료된 지원서 (읽기 전용) — '지원서 보기'로 노출
export default function SubmittedApplication({ motive }: SubmittedApplicationProps) {
  return (
    <div className="border-conx-gray-150 bg-conx-common-white w-full rounded-md border p-5">
      {/* 크루 프로필 */}
      <h3 className="text-kor-heading-3-semibold text-conx-common-black">크루 프로필</h3>
      <CrewProfileCard className="mt-3" />

      {/* 지원 동기 (읽기 전용) */}
      <h3 className="text-kor-heading-3-semibold text-conx-common-black mt-8">지원 동기</h3>
      <div className="bg-conx-gray-50 text-kor-body-1-medium text-conx-common-black mt-3 rounded-md p-4 break-words whitespace-pre-wrap">
        {motive}
      </div>
    </div>
  );
}
