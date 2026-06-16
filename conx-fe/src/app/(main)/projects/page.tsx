'use client';

import { useState } from 'react';
import { Card } from '@/components/common/Card';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';
import type { DateRange } from '@/components/common/DropdownCalendar';
import { DropdownCompact } from '@/components/common/DropdownCompact';
import { SearchBar } from '@/components/common/SearchBar';
import { INDUSTRY_OPTIONS, PROJECT_TYPE_OPTIONS, SORT_OPTIONS } from '@/constants/browse';

const MOCK_CARDS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  imageSrc: `https://placehold.co/337x203/f5f5f5/f5f5f5.png`,
  imageAlt: `프로젝트 이미지 ${i + 1}`,
  tag:
    i === 0
      ? { type: 'red' as const, label: '마감임박' }
      : i < 4
        ? { type: 'red' as const, label: '레이블' }
        : i === 4
          ? { type: 'red' as const, label: '레이블' }
          : undefined,
  title: i === 0 ? 'F&B 신제품 캠퍼스 소풍 프로젝트' : '프로젝트 이름',
  subtitle: i === 0 ? 'Sparkle Drink' : '기업명',
  category1: i === 0 ? 'F&B' : '카테고리',
  category2: i === 0 ? '숏폼·UGC' : '프로젝트 유형',
  startDate: i === 0 ? '2025.05.10' : '2000.00.00',
  endDate: i === 0 ? '2025.05.28' : '2000.00.00',
}));

export default function BrowseProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [industry, setIndustry] = useState<string>();
  const [projectType, setProjectType] = useState<string>();
  const [duration, setDuration] = useState<DateRange>();
  const [sort, setSort] = useState('latest');

  return (
    <main className="xlarge:max-w-272 large:max-w-230 mx-auto w-full max-w-367 px-6 pt-25 pb-82.5">
      <h1 className="text-kor-title-1-bold text-conx-common-black">프로젝트 둘러보기</h1>
      <p className="text-kor-heading-3-semibold text-conx-common-black mt-3">
        프로젝트를 비교하고, 우리 팀과 잘 맞는 협업 기회를 찾아보세요.
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
            placeholder="산업 분야"
            options={INDUSTRY_OPTIONS}
            value={industry}
            onChange={setIndustry}
          />
          <DropdownCompact
            placeholder="프로젝트 유형"
            options={PROJECT_TYPE_OPTIONS}
            value={projectType}
            onChange={setProjectType}
          />
          <DropdownCalendar
            placeholder="실행 기간"
            value={duration}
            onChange={setDuration}
            className="large:w-50 w-64.5"
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
            tag={card.tag}
            title={card.title}
            subtitle={card.subtitle}
            category1={card.category1}
            category2={card.category2}
            startDate={card.startDate}
            endDate={card.endDate}
          />
        ))}
      </div>
    </main>
  );
}
