'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/common/Card';
import { Toast } from '@/components/common/Toast';
import { useAuthStore } from '@/stores/auth';
import { USER_TYPE } from '@/types/auth';

interface BookmarkedProject {
  bookmarkId: number;
  projectId: number;
  projectImage: string[] | null;
  projectName: string;
  companyName: string;
  industry: string;
  projectType: string;
  projectStatus: string;
  projectStartDate: string;
  projectDeadline: string;
  subsidy: number;
  incentive: boolean;
}

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

function formatDate(dateStr: string): string {
  return dateStr.replace(/-/g, '.');
}

export default function ScrapPage() {
  const user = useAuthStore((s) => s.user);
  const userType = user?.userType ?? USER_TYPE.CREW;
  const isCompany = userType === USER_TYPE.COMPANY;

  const [projects, setProjects] = useState<BookmarkedProject[]>([]);
  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());
  const [undoTarget, setUndoTarget] = useState<{ bookmarkId: number; projectId: number } | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(!isCompany);

  useEffect(() => {
    const controller = new AbortController();

    if (isCompany) {
      // TODO: 기업 크루 북마크 API 연동
      return;
    }

    fetch('/api/crews/me/bookmarked-projects?page=0&size=100', { signal: controller.signal })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok && data.payload?.content) setProjects(data.payload.content);
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [isCompany]);

  const visibleProjects = projects.filter((p) => !removedIds.has(p.bookmarkId));
  const isEmpty = !isLoading && visibleProjects.length === 0;

  const handleUnscrap = useCallback(async (bookmarkId: number, projectId: number) => {
    setRemovedIds((prev) => new Set(prev).add(bookmarkId));
    setUndoTarget({ bookmarkId, projectId });

    await fetch(`/api/projects/${projectId}/bookmarks`, { method: 'DELETE' });
  }, []);

  const handleUndo = useCallback(async () => {
    if (!undoTarget) return;
    setRemovedIds((prev) => {
      const next = new Set(prev);
      next.delete(undoTarget.bookmarkId);
      return next;
    });

    await fetch(`/api/projects/${undoTarget.projectId}/bookmarks`, { method: 'POST' });
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
              ? null // TODO: 기업 크루 북마크 카드 렌더링
              : visibleProjects.map((project) => (
                  <Card
                    key={project.bookmarkId}
                    imageSrc={
                      project.projectImage?.[0] || 'https://placehold.co/337x203/f5f5f5/f5f5f5.png'
                    }
                    imageAlt={project.projectName}
                    defaultScraped
                    onScrapChange={(scraped) => {
                      if (!scraped) handleUnscrap(project.bookmarkId, project.projectId);
                    }}
                    title={project.projectName}
                    subtitle={project.companyName}
                    category1={project.industry}
                    category2={project.projectType}
                    startDate={formatDate(project.projectStartDate)}
                    endDate={formatDate(project.projectDeadline)}
                  />
                ))}
          </div>
        )}
      </main>

      {undoTarget !== null && (
        <Toast
          key={undoTarget.bookmarkId}
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
