'use client';

import { useEffect, useRef, useState } from 'react';
import IconDelete from '@/assets/icons/icon_delete.svg';
import { Chip } from '@/components/common/Chip';
import { API_ROUTES } from '@/constants/api';
import MessageCard from './MessageCard';

// 백엔드 filter 값 (카테고리 필터링은 서버에서 처리)
const FILTER_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'PROJECT_QUESTION_ANSWER', label: '담당자 Q&A' },
  { value: 'PROJECT', label: '프로젝트' },
] as const;
type FilterValue = (typeof FILTER_OPTIONS)[number]['value'];

// GET /api/v1/notifications 응답 아이템
interface NotificationItem {
  id: number;
  type: string;
  message: string;
  isRead: boolean;
  arriveTime: string; // ISO date-time
  sender: string;
}

// ISO date-time → "오전 10:58"
function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: true });
}

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationModal({ open, onClose }: NotificationModalProps) {
  const [filter, setFilter] = useState<FilterValue>('ALL');
  const [items, setItems] = useState<NotificationItem[] | null>(null); // null = 로딩 중
  const dialogRef = useRef<HTMLDivElement>(null);

  // 비모달 드롭다운: 열릴 때 패널로 포커스만 이동 (포커스 트랩 없음)
  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  // 열림 / 필터 변경 시 목록 조회 (setState는 async 콜백 안에서만 → set-state-in-effect 회피)
  useEffect(() => {
    if (!open) return;
    let active = true;
    fetch(`${API_ROUTES.NOTIFICATION.LIST}?filter=${filter}`)
      .then((r) => (r.ok ? r.json() : { payload: [] }))
      .then((d) => {
        if (active) setItems(Array.isArray(d.payload) ? d.payload : []);
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, [open, filter]);

  if (!open) return null;

  return (
    // 벨 wrapper 기준 앵커: 우측 끝을 스크랩 아이콘 왼쪽 끝에 맞춤 (-right-5), 폭 425px 고정
    // 비모달 드롭다운 → role="region" + aria-label (aria-modal 미사용: 배경 자유 탐색 허용)
    <div
      ref={dialogRef}
      role="region"
      tabIndex={-1}
      aria-label="알림"
      className="z-conx-dropdown drop-shadow-conx-drop-gray-15 bg-conx-gray-50 absolute top-full -right-5 mt-3 flex w-[425px] flex-col overflow-hidden rounded-[12px] focus:outline-none"
    >
      {/* Header (white) */}
      <div className="bg-conx-common-white shrink-0">
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
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
        {/* 카테고리 필터: 칩 3개 단순 토글이라 radiogroup 대신 toolbar + 토글 칩 */}
        <div role="toolbar" aria-label="알림 카테고리 필터" className="flex gap-2 px-5 pb-4">
          {FILTER_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              selected={filter === opt.value}
              onClick={() => {
                if (filter === opt.value) return;
                setItems(null); // 로딩 표시
                setFilter(opt.value);
              }}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Content: 카드 4개(=444px) 높이. 초과 시 스크롤 */}
      {items === null ? (
        <div className="flex h-[444px] items-center justify-center">
          <p className="text-kor-body-1-medium text-conx-gray-400">불러오는 중…</p>
        </div>
      ) : items.length > 0 ? (
        // role="list": Safari/VoiceOver는 list-style:none ul의 list role을 제거하므로 명시 복원
        <ul role="list" className="scrollbar-hide m-0 h-[444px] list-none overflow-y-auto p-0">
          {items.map((n) => (
            <li key={n.id}>
              <MessageCard
                sender={n.sender}
                time={formatTime(n.arriveTime)}
                message={n.message}
                read={n.isRead}
                // TODO: 라우트 명세 확정 후 클릭 시 관련 페이지로 이동 + 읽음 처리
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex h-[444px] flex-col items-center justify-center gap-4">
          {/* TODO: 디자인팀 빈 상태 일러스트로 교체 */}
          <div className="bg-conx-gray-150 h-20 w-20 rounded-md" aria-hidden />
          <p className="text-kor-body-1-medium text-conx-gray-400">알림이 아직 없어요</p>
        </div>
      )}
    </div>
  );
}
