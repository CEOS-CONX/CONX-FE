'use client';

import { useSyncExternalStore } from 'react';
import { useAuth } from '@/context/AuthContext';
import { USER_TYPE } from '@/types/auth';
import { DEV_PREVIEW_ROLE } from './previewRole';

// 값이 마운트 동안 안 바뀌므로 구독은 no-op (네비게이션 시엔 컴포넌트가 remount 됨)
const noopSubscribe = () => () => {};

// ?as= 미리보기 파라미터를 클라이언트에서 읽음.
// (useSearchParams 는 Next 16에서 Suspense/스트리밍 postpone 을 유발 → 대신 location 을 직접 읽음)
// useSyncExternalStore 라 SSR 안전 + 하이드레이션 불일치 없음(서버=null → 하이드레이션 후 클라이언트 값 반영).
export function useMypagePreviewAs(): 'company' | 'crew' | null {
  const raw = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get('as'),
    () => null,
  );
  return raw === 'company' || raw === 'crew' ? raw : null;
}

// 크루/기업 뷰 판정. 우선순위: URL(?as=company|crew) > DEV_PREVIEW_ROLE > 실제 로그인 userType
export function useMypageIsCompany(): boolean {
  const { user } = useAuth();
  const as = useMypagePreviewAs();
  if (as) return as === 'company';
  if (DEV_PREVIEW_ROLE) return DEV_PREVIEW_ROLE === 'company';
  return user?.userType === USER_TYPE.COMPANY;
}
