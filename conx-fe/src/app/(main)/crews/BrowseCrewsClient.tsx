'use client';

import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/common/Card';
import { DropdownCompact } from '@/components/common/DropdownCompact';
import { SearchBar } from '@/components/common/SearchBar';
import { API_ROUTES } from '@/constants/api';
import {
  CREW_TYPE_OPTIONS,
  CREW_TYPE_LABEL,
  INDUSTRY_OPTIONS,
  INDUSTRY_LABEL,
  RATING_OPTIONS,
  SORT_OPTIONS,
} from '@/constants/browse';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface Crew {
  crewId: number;
  profileImage: string | null;
  crewName: string | null;
  crewIntroduction: string | null;
  category: string | null;
  crewType: string | null;
  point: number;
  cumulative: number;
  bookmarked: boolean;
}

interface BrowseCrewsClientProps {
  initialCrews: Crew[];
  initialParams: Record<string, string | undefined>;
  initialIsLastPage: boolean;
}

const SKELETON_ITEMS = Array.from({ length: 12 }, (_, i) => (
  <div key={i} className="h-60 animate-pulse rounded-lg bg-gray-100" />
));

const CrewCard = memo(function CrewCard({ crew }: { crew: Crew }) {
  const handleScrapChange = useCallback(async () => {
    const res = await fetch(`/api/companies/me/bookmarked-crews/${crew.crewId}`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('scrap failed');
  }, [crew.crewId]);

  return (
    <Link href={`/crews/${crew.crewId}`}>
      <Card
        imageSrc={crew.profileImage || '/images/OG_image.png'}
        imageAlt={crew.crewName ?? '크루 이미지'}
        defaultScraped={crew.bookmarked}
        onScrapChange={handleScrapChange}
        title={crew.crewName ?? '크루명'}
        subtitle={crew.crewIntroduction ?? ''}
        category1={INDUSTRY_LABEL[crew.category ?? ''] ?? crew.category ?? ''}
        category2={CREW_TYPE_LABEL[crew.crewType ?? ''] ?? crew.crewType ?? ''}
        rating={crew.point}
        totalCount={crew.cumulative}
      />
    </Link>
  );
});

export default function BrowseCrewsClient({
  initialCrews,
  initialParams,
  initialIsLastPage,
}: BrowseCrewsClientProps) {
  const [searchQuery, setSearchQuery] = useState(initialParams.keyword ?? '');
  const [field, setField] = useState<string | undefined>(initialParams.category);
  const [crewType, setCrewType] = useState<string | undefined>(initialParams.crewType);
  const [rating, setRating] = useState<string | undefined>(initialParams.rating);
  const [sort, setSort] = useState(initialParams.sort ?? 'RECENT');

  const filterParams = useMemo(() => {
    const p = new URLSearchParams();
    if (searchQuery) p.set('keyword', searchQuery);
    if (field) p.set('category', field);
    if (crewType) p.set('crewType', crewType);
    if (sort) p.set('sort', sort);
    return p;
  }, [searchQuery, field, crewType, sort]);

  const { items, isLoading, isLoadingMore, hasMore, sentinelRef } = useInfiniteScroll<Crew>({
    endpoint: API_ROUTES.CREW.LIST,
    initialItems: initialCrews,
    initialIsLastPage,
    params: filterParams,
  });

  useEffect(() => {
    const url = `${window.location.pathname}?${filterParams}`;
    window.history.replaceState(null, '', url);
  }, [filterParams]);

  return (
    <main className="xlarge:max-w-272 large:max-w-230 mx-auto w-full max-w-367 px-6 pt-25 pb-82.5">
      <h1 className="text-kor-title-1-bold text-conx-common-black">크루 둘러보기</h1>
      <p className="text-kor-heading-3-semibold text-conx-common-black mt-3">
        프로젝트 성격과 잘 맞는 크루를 탐색하고 협업을 시작해 보세요.
      </p>

      <div className="mt-15 flex items-start justify-between">
        <div className="flex items-center gap-3.75">
          <SearchBar
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="검색창"
            className="xlarge:w-68.75 large:w-50 w-114.25"
          />
          <DropdownCompact
            placeholder="활동 분야"
            options={INDUSTRY_OPTIONS}
            value={field}
            onChange={setField}
          />
          <DropdownCompact
            placeholder="크루 유형"
            options={CREW_TYPE_OPTIONS}
            value={crewType}
            onChange={setCrewType}
          />
          <DropdownCompact
            placeholder="별점"
            options={RATING_OPTIONS}
            value={rating}
            onChange={setRating}
          />
        </div>
        <DropdownCompact
          type="ghost"
          placeholder="최신등록순"
          options={SORT_OPTIONS}
          value={sort}
          onChange={setSort}
        />
      </div>

      <div className="mt-8 grid grid-cols-4 gap-x-6 gap-y-18.5">
        {isLoading
          ? SKELETON_ITEMS
          : items.map((crew) => <CrewCard key={crew.crewId} crew={crew} />)}
      </div>

      {isLoadingMore && (
        <div className="flex justify-center py-10">
          <div className="border-t-conx-primary-200 h-8 w-8 animate-spin rounded-full border-2 border-gray-300" />
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-1" />}
    </main>
  );
}
