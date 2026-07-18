'use client';

import { useState } from 'react';
import TabNumber from './TabNumber';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import DropdownCompact from '@/components/common/DropdownCompact/DropdownCompact';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';
import Card from '@/components/common/Card/Card';
import Pagination from '@/components/common/Pagination/Pagination';
import { INDUSTRY_OPTIONS, PROJECT_TYPE_OPTIONS } from '@/constants/browse';
import { PROJECT_TAB_COUNTS, PROJECT_CARDS, getProjectTag } from './mockData';
import type { TagType } from '@/components/common/Tag/Tag';

const CARDS_PER_PAGE = 12;

export default function WorkspaceProjects() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(PROJECT_CARDS.length / CARDS_PER_PAGE));
  const pagedCards = PROJECT_CARDS.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE,
  );
  const isEmpty = PROJECT_CARDS.length === 0;

  // 3개씩 행 분리
  const rows: (typeof pagedCards)[] = [];
  for (let i = 0; i < pagedCards.length; i += 3) {
    rows.push(pagedCards.slice(i, i + 3));
  }

  return (
    <div className="flex flex-col gap-6 pr-36 pb-63">
      {/* 탭바 + 필터바 */}
      <div className="flex flex-col">
        {/* 탭바 */}
        <div className="border-conx-gray-150 flex border-b">
          {PROJECT_TAB_COUNTS.map((tab, i) => (
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

        {/* 필터바 */}
        <div className="border-conx-gray-150 flex items-start justify-between border-b py-4">
          <SearchBar
            placeholder="찾고 싶은 프로젝트를 검색해 보세요."
            className="w-114.25 border-transparent!"
          />
          <div className="flex gap-2">
            <DropdownCompact type="ghost" options={INDUSTRY_OPTIONS} placeholder="산업 분야" />
            <DropdownCompact
              type="ghost"
              options={PROJECT_TYPE_OPTIONS}
              placeholder="프로젝트 유형"
            />
            <DropdownCalendar variant="ghost" mode="range" align="right" placeholder="실행 기간" />
          </div>
        </div>
      </div>

      {/* 카드 그리드 + 페이지네이션 */}
      {isEmpty ? (
        <div className="flex flex-col items-center gap-16">
          <p className="text-kor-heading-3-semibold text-conx-gray-500">
            아직 필요한 작업이 없습니다.
          </p>
          <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-19">
          <div className="flex w-full flex-col gap-18.5">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-6">
                {row.map((card) => {
                  const tag = getProjectTag(card.status);
                  return (
                    <div key={card.id} className="w-84.25">
                      <Card
                        imageSrc="/placeholder.png"
                        imageAlt={card.title}
                        tag={{ type: tag.type as TagType, label: tag.label }}
                        title={card.title}
                        subtitle={card.brand}
                        category1={card.category1}
                        category2={card.category2}
                        startDate={card.startDate}
                        endDate={card.endDate}
                      />
                    </div>
                  );
                })}
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
