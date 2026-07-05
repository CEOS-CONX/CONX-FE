'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/common/Card';
import { Toast } from '@/components/common/Toast';

import { USER_TYPE, type UserType } from '@/types/auth';

const MOCK_CREW_SCRAPS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  imageSrc: `https://placehold.co/337x203/f5f5f5/f5f5f5.png`,
  imageAlt: `스크랩한 크루 이미지 ${i + 1}`,
  title: i === 0 ? 'CEOS 세오스' : '크루명',
  subtitle: i === 0 ? '"신촌권 원앤온리 IT 창업 동아리"' : '캐치프레이즈',
  category1: i === 0 ? 'IT' : '활동 분야',
  category2: i === 0 ? '동아리' : '크루 유형',
  rating: i === 0 ? 5.0 : 0.0,
  totalCount: i === 0 ? 2323 : 0,
}));

const MOCK_PROJECT_SCRAPS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  imageSrc: `https://placehold.co/337x203/f5f5f5/f5f5f5.png`,
  imageAlt: `스크랩한 프로젝트 이미지 ${i + 1}`,
  title: i === 0 ? 'F&B 신제품 캠퍼스 숏폼 프로젝트' : '프로젝트 이름',
  subtitle: i === 0 ? 'Sparkle Drink' : '기업명',
  category1: i === 0 ? 'F&B' : '카테고리',
  category2: i === 0 ? '숏폼·UGC' : '프로젝트 유형',
  startDate: i === 0 ? '2025.05.10' : '2000.00.00',
  endDate: i === 0 ? '2025.05.28' : '2000.00.00',
}));

const EMPTY_STATE = {
  [USER_TYPE.COMPANY]: {
    message1: '아직 스크랩한 크루가 없어요',
    message2: '크루 둘러보기에서 관심 있는 크루를 저장해보세요',
    buttonLabel: '크루 둘러보러 가기',
    buttonHref: '/crews',
  },
  [USER_TYPE.CREW]: {
    message1: '아직 스크랩한 프로젝트가 없어요',
    message2: '프로젝트 둘러보기에서 관심 있는 프로젝트를 저장해보세요',
    buttonLabel: '프로젝트 둘러보러 가기',
    buttonHref: '/projects',
  },
} as const;

export default function ScrapPage() {
  // TODO: 인증 컨텍스트에서 유저 타입 가져오기
  const userType: UserType = USER_TYPE.COMPANY;

  const isCompany = userType === USER_TYPE.COMPANY;
  const allScraps = isCompany ? MOCK_CREW_SCRAPS : MOCK_PROJECT_SCRAPS;

  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());
  const [undoTarget, setUndoTarget] = useState<number | null>(null);

  const visibleScraps = allScraps.filter((card) => !removedIds.has(card.id));
  const isEmpty = visibleScraps.length === 0;

  const handleUnscrap = useCallback((id: number) => {
    setRemovedIds((prev) => new Set(prev).add(id));
    setUndoTarget(id);
  }, []);

  const handleUndo = useCallback(() => {
    if (undoTarget === null) return;
    setRemovedIds((prev) => {
      const next = new Set(prev);
      next.delete(undoTarget);
      return next;
    });
    setUndoTarget(null);
  }, [undoTarget]);

  const handleToastClose = useCallback(() => {
    setUndoTarget(null);
  }, []);

  const emptyState = EMPTY_STATE[userType];

  return (
    <>
      <main
        className={`xxlarge:max-w-367 xlarge:max-w-272 mx-auto w-full max-w-230 px-6 pt-25 ${isEmpty ? 'pb-230.5' : 'pb-82.5'}`}
      >
        <h1 className="text-kor-title-1-bold text-conx-common-black">스크랩</h1>

        {isEmpty ? (
          <div className="mt-95.75 flex flex-col items-center gap-10">
            <div className="bg-conx-gray-300 size-30" />
            <div className="flex flex-col items-center gap-7.25">
              <div className="text-kor-body-1-bold text-conx-gray-450 text-center">
                <p>{emptyState.message1}</p>
                <p>{emptyState.message2}</p>
              </div>
              <Link
                href={emptyState.buttonHref}
                className="bg-conx-primary-200 text-kor-body-1-semibold text-conx-common-black rounded-md px-3 py-2"
              >
                {emptyState.buttonLabel}
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-27.25 grid grid-cols-4 gap-x-6 gap-y-18.5">
            {isCompany
              ? visibleScraps.map((card) => (
                  <Card
                    key={card.id}
                    imageSrc={card.imageSrc}
                    imageAlt={card.imageAlt}
                    defaultScraped
                    onScrapChange={(scraped) => {
                      if (!scraped) handleUnscrap(card.id);
                    }}
                    title={card.title}
                    subtitle={card.subtitle}
                    category1={card.category1}
                    category2={card.category2}
                    rating={'rating' in card ? card.rating : undefined}
                    totalCount={'totalCount' in card ? card.totalCount : undefined}
                  />
                ))
              : visibleScraps.map((card) => (
                  <Card
                    key={card.id}
                    imageSrc={card.imageSrc}
                    imageAlt={card.imageAlt}
                    defaultScraped
                    onScrapChange={(scraped) => {
                      if (!scraped) handleUnscrap(card.id);
                    }}
                    title={card.title}
                    subtitle={card.subtitle}
                    category1={card.category1}
                    category2={card.category2}
                    startDate={'startDate' in card ? card.startDate : undefined}
                    endDate={'endDate' in card ? card.endDate : undefined}
                  />
                ))}
          </div>
        )}
      </main>

      {undoTarget !== null && (
        <Toast
          key={undoTarget}
          message="스크랩을 취소했습니다"
          actionLabel="되돌리기"
          onAction={handleUndo}
          onClose={handleToastClose}
          className="z-conx-toast fixed top-226.5 left-1/2 -translate-x-1/2"
        />
      )}
    </>
  );
}
