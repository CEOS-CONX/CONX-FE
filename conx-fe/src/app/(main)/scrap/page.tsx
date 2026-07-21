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

interface BookmarkedCrew {
  crewId: number;
  profileImage: string | null;
  crewName: string | null;
  crewIntroduction: string | null;
  crewType: string | null;
  memberAmount: number;
  cumulative: number;
  point: number;
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
  const [crews, setCrews] = useState<BookmarkedCrew[]>([]);
  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());
  const [undoTarget, setUndoTarget] = useState<{
    id: number;
    type: 'project' | 'crew';
    projectId?: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();

    if (isCompany) {
      fetch('/api/companies/me/bookmarked-crews', { signal: controller.signal })
        .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
          if (ok && Array.isArray(data.payload)) setCrews(data.payload);
        })
        .catch((e) => {
          if (e instanceof DOMException && e.name === 'AbortError') return;
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsLoading(false);
        });
    } else {
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
    }

    return () => controller.abort();
  }, [user, isCompany]);

  const visibleProjects = projects.filter((p) => !removedIds.has(p.bookmarkId));
  const visibleCrews = crews.filter((c) => !removedIds.has(c.crewId));
  const isEmpty =
    !isLoading && (isCompany ? visibleCrews.length === 0 : visibleProjects.length === 0);

  const handleUnscrapProject = useCallback((bookmarkId: number, projectId: number) => {
    setRemovedIds((prev) => new Set(prev).add(bookmarkId));
    setUndoTarget({ id: bookmarkId, type: 'project', projectId });
    fetch(`/api/projects/${projectId}/bookmarks`, { method: 'DELETE' });
  }, []);

  const handleUnscrapCrew = useCallback((crewId: number) => {
    setRemovedIds((prev) => new Set(prev).add(crewId));
    setUndoTarget({ id: crewId, type: 'crew' });
    fetch(`/api/companies/me/bookmarked-crews/${crewId}`, { method: 'PATCH' });
  }, []);

  const handleUndo = useCallback(async () => {
    if (!undoTarget) return;
    setRemovedIds((prev) => {
      const next = new Set(prev);
      next.delete(undoTarget.id);
      return next;
    });

    if (undoTarget.type === 'project' && undoTarget.projectId) {
      await fetch(`/api/projects/${undoTarget.projectId}/bookmarks`, { method: 'POST' });
    } else if (undoTarget.type === 'crew') {
      await fetch(`/api/companies/me/bookmarked-crews/${undoTarget.id}`, { method: 'PATCH' });
    }
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
              ? visibleCrews.map((crew) => (
                  <Link key={crew.crewId} href={`/crews/${crew.crewId}`}>
                    <Card
                      imageSrc={crew.profileImage || '/images/OG_image.png'}
                      imageAlt={crew.crewName ?? '크루 이미지'}
                      defaultScraped
                      onScrapChange={(scraped) => {
                        if (!scraped) handleUnscrapCrew(crew.crewId);
                      }}
                      title={crew.crewName ?? '크루명'}
                      subtitle={crew.crewIntroduction ?? ''}
                      category1={crew.crewType ?? ''}
                      rating={crew.point}
                      totalCount={crew.cumulative}
                    />
                  </Link>
                ))
              : visibleProjects.map((project) => (
                  <Link key={project.bookmarkId} href={`/projects/${project.projectId}`}>
                    <Card
                      imageSrc={project.projectImage?.[0] || '/images/OG_image.png'}
                      imageAlt={project.projectName}
                      defaultScraped
                      onScrapChange={(scraped) => {
                        if (!scraped) handleUnscrapProject(project.bookmarkId, project.projectId);
                      }}
                      title={project.projectName}
                      subtitle={project.companyName}
                      category1={project.industry}
                      category2={project.projectType}
                      startDate={formatDate(project.projectStartDate)}
                      endDate={formatDate(project.projectDeadline)}
                    />
                  </Link>
                ))}
          </div>
        )}
      </main>

      {undoTarget !== null && (
        <Toast
          key={undoTarget.id}
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
