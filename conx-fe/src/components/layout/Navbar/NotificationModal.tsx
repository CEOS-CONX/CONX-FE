'use client';

import { useState } from 'react';
import IconCheckboxChecked from '@/assets/icons/icon_checkbox_checked.svg';
import IconCheckboxDefault from '@/assets/icons/icon_checkbox_default.svg';
import IconDelete from '@/assets/icons/icon_delete.svg';
import { DropdownCompact } from '@/components/common/DropdownCompact';
import type { DropdownCompactOption } from '@/components/common/DropdownCompact';

const FILTER_OPTIONS: DropdownCompactOption[] = [
  { value: 'all', label: '전체' },
  { value: 'qna', label: '담당자 Q&A' },
  { value: 'project', label: '프로젝트' },
];

type NotificationCategory = 'qna' | 'project';

interface NotificationItem {
  id: number;
  category: NotificationCategory;
  sender: string;
  time: string;
  message: string;
}

// 임시 mock — 나중에 API 연동으로 교체
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    category: 'project',
    sender: '크루명 or 회사명',
    time: '오전 10:58',
    message: '[프로젝트 검수 완료] "프로젝트 이름"이 등록되었어요! 지금 바로 확인해보세요.',
  },
  {
    id: 2,
    category: 'project',
    sender: '보낸 이',
    time: '오전 10:58',
    message:
      '[제출 알림] "크루 이름"이 "프로젝트 이름"의 결과물을 제출했어요! 지금 바로 확인해보세요.',
  },
  {
    id: 3,
    category: 'qna',
    sender: '보낸 이',
    time: '오전 10:58',
    message: '"CEOS 세오스"에서 새로운 메일이 도착했어요',
  },
  {
    id: 4,
    category: 'project',
    sender: '보낸 이',
    time: '오전 10:58',
    message: '[크루 추천] "프로젝트 이름"에 딱 맞는 크루를 찾았어요! 지금 바로 확인해보세요.',
  },
];

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationModal({ open, onClose }: NotificationModalProps) {
  const [filter, setFilter] = useState<string>('all');
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());

  if (!open) return null;

  const items =
    filter === 'all' ? MOCK_NOTIFICATIONS : MOCK_NOTIFICATIONS.filter((n) => n.category === filter);

  function toggleChecked(id: number) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    // 벨 wrapper 기준 앵커: 우측 끝을 스크랩 아이콘 왼쪽 끝에 맞춤
    // (-right-5 = 벨↔스크랩 간격 gap-5(20px)만큼 오른쪽으로), 폭 425px 고정
    <div
      role="dialog"
      aria-label="알림"
      className="z-conx-dropdown shadow-conx-drop-gray bg-conx-gray-50 absolute top-full -right-5 mt-3 flex h-[602px] w-[425px] flex-col overflow-hidden rounded-[12px]"
    >
      {/* Header (white) */}
      <div className="bg-conx-common-white shrink-0">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-kor-heading-2-bold text-conx-common-black">알림</h2>
          <button
            type="button"
            aria-label="알림 닫기"
            onClick={onClose}
            className="hover:bg-conx-opacity-gray-6 flex cursor-pointer items-center justify-center rounded-md p-1"
          >
            <IconDelete className="h-5.5 w-5.5" />
          </button>
        </div>
        <div className="px-6 pb-4">
          <DropdownCompact
            type="line"
            options={FILTER_OPTIONS}
            value={filter}
            onChange={setFilter}
          />
        </div>
      </div>

      {/* Content: 리스트 or 빈 상태 */}
      {items.length > 0 ? (
        <ul className="flex-1 overflow-y-auto">
          {items.map((n) => {
            const checked = checkedIds.has(n.id);
            const Checkbox = checked ? IconCheckboxChecked : IconCheckboxDefault;
            return (
              <li key={n.id} className="border-conx-gray-100 flex gap-3 border-b px-6 py-4">
                <button
                  type="button"
                  aria-label={checked ? '선택 해제' : '선택'}
                  aria-pressed={checked}
                  onClick={() => toggleChecked(n.id)}
                  className="mt-0.5 shrink-0 cursor-pointer"
                >
                  <Checkbox className="h-5 w-5" />
                </button>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-kor-caption-1-medium text-conx-gray-450 truncate">
                      {n.sender}
                    </span>
                    <span className="text-kor-caption-1-medium text-conx-gray-450 shrink-0">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-kor-label-1-medium text-conx-common-black">{n.message}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          {/* TODO: 디자인팀 빈 상태 일러스트로 교체 */}
          <div className="bg-conx-gray-150 h-20 w-20 rounded-md" aria-hidden />
          <p className="text-kor-body-1-medium text-conx-gray-400">알림이 아직 없어요</p>
        </div>
      )}
    </div>
  );
}
