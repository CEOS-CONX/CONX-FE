'use client';

import { useState } from 'react';
import { Card } from '@/components/common/Card';
import { DropdownCompact } from '@/components/common/DropdownCompact';
import { SearchBar } from '@/components/common/SearchBar';
import {
  CREW_TYPE_OPTIONS,
  INDUSTRY_OPTIONS,
  RATING_OPTIONS,
  SORT_OPTIONS,
} from '@/constants/browse';

const MOCK_CARDS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  imageSrc: `https://placehold.co/337x203/f5f5f5/f5f5f5.png`,
  imageAlt: `크루 이미지 ${i + 1}`,
  title: i === 0 ? 'CEOS 세오스' : '크루명',
  subtitle: i === 0 ? '"신촌권 원앤온리 IT 창업 동아리"' : '캐치프레이즈',
  category1: i === 0 ? 'IT' : '활동 분야',
  category2: i === 0 ? '동아리' : '크루 유형',
  rating: i === 0 ? 5.0 : 0.0,
  totalCount: i === 0 ? 2323 : 0,
}));

export default function BrowseCrewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [field, setField] = useState<string>();
  const [crewType, setCrewType] = useState<string>();
  const [rating, setRating] = useState<string>();
  const [sort, setSort] = useState('latest');

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
        {MOCK_CARDS.map((card) => (
          <Card
            key={card.id}
            imageSrc={card.imageSrc}
            imageAlt={card.imageAlt}
            title={card.title}
            subtitle={card.subtitle}
            category1={card.category1}
            category2={card.category2}
            rating={card.rating}
            totalCount={card.totalCount}
          />
        ))}
      </div>
    </main>
  );
}
