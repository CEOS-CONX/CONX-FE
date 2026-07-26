'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import IconArrowRight from '@/assets/icons/icon_arrowRight_stroke.svg';

interface CrewProfileCardProps {
  className?: string;
}

// 지원 전 크루 정보 (GET /api/v1/projects/applications/my-info payload)
interface MyInfo {
  crewId: number;
  crewName: string;
  managerName: string;
  editedTime: string;
  isEditDone: boolean;
}

const fmtDate = (s?: string) => (s ? s.slice(0, 10).replace(/-/g, '.') : '');

// 크루 프로필 카드 — 지원하기 패널 / 제출 지원서(읽기전용) 공용. 로그인 크루의 my-info 를 직접 조회.
export default function CrewProfileCard({ className }: CrewProfileCardProps) {
  const [info, setInfo] = useState<MyInfo | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/projects/applications/my-info');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setInfo(data.payload ?? null);
      } catch {
        /* 실패 시 빈 상태 유지 */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Link
      href={info ? `/crews/${info.crewId}` : '#'}
      onClick={(e) => {
        if (!info) e.preventDefault(); // my-info 로딩 전엔 이동 막음
      }}
      className={`border-conx-gray-100 hover:bg-conx-gray-50 active:bg-conx-gray-150 flex items-center gap-4 rounded-md border py-4 pr-2 pl-4 text-left transition-colors ${className ?? ''}`}
    >
      <div className="min-w-0 flex-1">
        {/* 상단은 고정 라벨 '프로필명' (데이터 아님) */}
        <p className="text-kor-body-1-semibold text-conx-common-black">프로필명</p>
        <dl className="text-kor-label-1-medium mt-2 flex flex-col gap-1">
          <div className="flex gap-3">
            <dt className="text-conx-gray-350 w-14 shrink-0">크루명</dt>
            <dd className="text-conx-common-black">{info?.crewName ?? '—'}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-conx-gray-350 w-14 shrink-0">대표자명</dt>
            <dd className="text-conx-common-black">{info?.managerName ?? '—'}</dd>
          </div>
        </dl>
        <p className="border-conx-gray-100 text-kor-caption-1-medium text-conx-gray-350 mt-3 border-t pt-3">
          {fmtDate(info?.editedTime) || '—'}
          <span className="text-conx-gray-200 mx-1">|</span>
          {info ? (info.isEditDone ? '작성 완료' : '작성 중') : '—'}
        </p>
      </div>
      <IconArrowRight className="h-[18px] w-[18px] shrink-0" />
    </Link>
  );
}
