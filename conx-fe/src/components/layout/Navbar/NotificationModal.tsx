'use client';

import { useEffect, useRef, useState } from 'react';
import IconDelete from '@/assets/icons/icon_delete.svg';
import { Chip } from '@/components/common/Chip';
import MessageCard from './MessageCard';

type NotificationCategory = 'qna' | 'project';
type FilterValue = 'all' | NotificationCategory;

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'qna', label: '담당자 Q&A' },
  { value: 'project', label: '프로젝트' },
];

interface NotificationItem {
  id: number;
  category: NotificationCategory;
  sender: string;
  time: string;
  message: string;
  // TODO(나중에): API 연동 시 각 알림의 실제 읽음 여부 채우기 → MessageCard read로 전달
  //              + 안읽은 개수(read=false 개수)로 벨 아이콘 뱃지 표시
  read?: boolean;
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
  const [filter, setFilter] = useState<FilterValue>('all');
  const dialogRef = useRef<HTMLDivElement>(null);

  // 비모달 드롭다운: 열릴 때 패널로 포커스만 이동 (포커스 트랩 없음 — 바깥 콘텐츠 자유 탐색 허용)
  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const items =
    filter === 'all' ? MOCK_NOTIFICATIONS : MOCK_NOTIFICATIONS.filter((n) => n.category === filter);

  return (
    // 벨 wrapper 기준 앵커: 우측 끝을 스크랩 아이콘 왼쪽 끝에 맞춤
    // (-right-5 = 벨↔스크랩 간격 gap-5(20px)만큼 오른쪽으로), 폭 425px 고정
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
        {/* 카테고리 필터: 칩 3개 단순 토글이라 radiogroup(화살표 키 필수) 대신 toolbar + 토글 칩 */}
        <div role="toolbar" aria-label="알림 카테고리 필터" className="flex gap-2 px-5 pb-4">
          {FILTER_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              selected={filter === opt.value}
              onClick={() => setFilter(opt.value)}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Content: 영역 높이를 카드 4개(=444px)에 맞춤. 초과 시 스크롤 / 미만 시 아래 빈칸 */}
      {items.length > 0 ? (
        // role="list": Safari/VoiceOver는 list-style:none ul의 list role을 제거하므로 명시 복원
        <ul role="list" className="scrollbar-hide m-0 h-[444px] list-none overflow-y-auto p-0">
          {items.map((n) => (
            <li key={n.id}>
              <MessageCard
                sender={n.sender}
                time={n.time}
                message={n.message}
                read={n.read}
                // TODO: 라우트 명세 확정 후 클릭 시 관련 페이지로 이동
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
