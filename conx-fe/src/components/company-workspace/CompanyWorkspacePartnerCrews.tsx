'use client';

import { useState } from 'react';
import Link from 'next/link';
import TabNumber from '@/components/workspace/TabNumber';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import DropdownCompact from '@/components/common/DropdownCompact/DropdownCompact';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';
import Card from '@/components/common/Card/Card';
import Pagination from '@/components/common/Pagination/Pagination';
import { ACTIVITY_FIELD_OPTIONS, CREW_TYPE_OPTIONS } from '@/constants/browse';
import { PARTNER_CREW_CARDS, getPartnerCrewTag } from './mockData';
import type { TagType } from '@/components/common/Tag/Tag';

const CARDS_PER_PAGE = 12;

const TABS = [
  { label: '전체', status: null },
  { label: '매칭 전', status: '매칭 전' },
  { label: '진행 중', status: '진행 중' },
  { label: '정산 완료', status: '정산 완료' },
] as const;

const TAB_COUNTS = TABS.map((tab) => ({
  label: tab.label,
  count: tab.status
    ? PARTNER_CREW_CARDS.filter((c) => c.status === tab.status).length
    : PARTNER_CREW_CARDS.length,
}));

export default function CompanyWorkspacePartnerCrews() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const filterStatus = TABS[activeTab]?.status ?? null;
  const filteredCards = filterStatus
    ? PARTNER_CREW_CARDS.filter((card) => card.status === filterStatus)
    : PARTNER_CREW_CARDS;

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / CARDS_PER_PAGE));
  const pagedCards = filteredCards.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE,
  );
  const isEmpty = filteredCards.length === 0;

  const rows: (typeof pagedCards)[] = [];
  for (let i = 0; i < pagedCards.length; i += 3) {
    rows.push(pagedCards.slice(i, i + 3));
  }

  return (
    <div className="flex flex-col gap-6 pr-36 pb-63">
      <div className="flex flex-col">
        <div className="border-conx-gray-150 flex border-b">
          {TAB_COUNTS.map((tab, i) => (
            <TabNumber
              key={tab.label}
              label={tab.label}
              count={tab.count}
              state={activeTab === i ? 'active' : 'disabled'}
              onClick={() => {
                setActiveTab(i);
                setCurrentPage(1);
              }}
            />
          ))}
        </div>

        <div className="border-conx-gray-150 flex items-start justify-between border-b py-4">
          <SearchBar
            placeholder="찾고 싶은 크루를 검색해 보세요."
            className="w-114.25 border-transparent!"
          />
          <div className="flex gap-2">
            <DropdownCompact
              type="ghost"
              options={ACTIVITY_FIELD_OPTIONS}
              placeholder="활동 분야"
            />
            <DropdownCompact type="ghost" options={CREW_TYPE_OPTIONS} placeholder="크루 유형" />
            <DropdownCalendar variant="ghost" mode="range" align="right" placeholder="실행 기간" />
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center gap-16">
          <p className="text-kor-heading-3-semibold text-conx-gray-500">
            아직 파트너 크루가 없습니다.
          </p>
          <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-19">
          <div className="flex w-full flex-col gap-18.5">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-6">
                {row.map((card) => {
                  const tag = getPartnerCrewTag(card.status);
                  return (
                    <Link key={card.id} href={`/crews/${card.id}`} className="w-84.25">
                      <Card
                        imageSrc="/placeholder.png"
                        imageAlt={card.name}
                        tag={{ type: tag.type as TagType, label: tag.label }}
                        title={card.name}
                        subtitle={card.catchphrase}
                        category1={card.field}
                        category2={card.crewType}
                        rating={card.rating}
                        totalCount={card.totalCount}
                      />
                    </Link>
                  );
                })}
                {row.length < 3 &&
                  Array.from({ length: 3 - row.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-84.25" />
                  ))}
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
