'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownForm } from '@/components/common/DropdownForm';
import { Pagination } from '@/components/common/Pagination';
import { Toast } from '@/components/common/Toast';
import ImageUploader from '@/components/mypage/ImageUploader';
import { type Portfolio } from '@/components/mypage/ImageUploaderInput';
import PageIntro from '@/components/mypage/PageIntro';
import PortfolioUploadModal, {
  type PortfolioDraft,
} from '@/components/mypage/PortfolioUploadModal';
import ProfileImage from '@/components/mypage/ProfileImage';
import ProfileRegisterModal from '@/components/mypage/ProfileRegisterModal';
import ProjectRow, { PROJECT_COLS } from '@/components/mypage/ProjectRow';
import TagSelectField, { type TagCategory } from '@/components/mypage/TagSelectField';
import TextFieldLabeled from '@/components/mypage/TextFieldLabeled';
import TextFieldTagInput from '@/components/mypage/TextFieldTagInput';
import TextFieldUpload from '@/components/mypage/TextFieldUpload';
import TextFieldUrl from '@/components/mypage/TextFieldUrl';
import { uploadFile } from '@/components/project-create/utils/projectApi';
import {
  ACTIVITY_FIELD_OPTIONS,
  CREW_TYPE_OPTIONS,
  PROJECT_TYPE_OPTIONS,
} from '@/constants/browse';
import { FieldLabel, SectionTitle } from './profileForm';

const labelOf = (opts: { value: string; label: string }[], v: string) =>
  opts.find((o) => o.value === v)?.label ?? v;
const fmtDate = (s?: string) => (s ? s.slice(0, 10).replace(/-/g, '.') : '');

// 대표 프로젝트 후보 → 선택 테이블 행
type ProjectRowData = {
  id: string;
  name: string;
  brand: string;
  period: string;
  workType: string;
  rating: number;
};
type Candidate = {
  projectId: number;
  projectName: string;
  brandName: string;
  projectType: string;
  projectStartDate: string;
  projectDeadline: string;
  selected: boolean;
};

const STRENGTH_OPTIONS: TagCategory[] = [
  {
    category: '기획 · 문제 해결',
    tags: ['기획부터 실행까지', '문제 정의 중심', '리서치 기반', '사용자 경험 중심'],
  },
  { category: '실행 · 구현', tags: ['빠른 실행력', '반복 개선', '일정 준수'] },
  {
    category: '디테일 · 커뮤니케이션',
    tags: ['디테일까지 고려', '명확한 커뮤니케이션', '꼼꼼한 문서화'],
  },
];

const PAGE_SIZE = 5;

export default function CrewProfilePage() {
  // 기본 정보
  const [profileSrc, setProfileSrc] = useState<string>(); // 화면 미리보기
  const [profileImageUrl, setProfileImageUrl] = useState<string>(); // 저장용 S3 URL
  const [crewId, setCrewId] = useState<number>(); // 기본 프로필 이미지 배정용 seed
  const [toast, setToast] = useState<{
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);
  const [crewName, setCrewName] = useState('');
  const [crewType, setCrewType] = useState('');
  const [activity, setActivity] = useState('');
  const [schools, setSchools] = useState<string[]>([]);
  const [memberCount, setMemberCount] = useState('');
  // 필수 필드 에러 (크루명·크루유형·활동분야·멤버 인원수)
  const [crewNameError, setCrewNameError] = useState<string>();
  const [crewTypeError, setCrewTypeError] = useState<string>();
  const [activityError, setActivityError] = useState<string>();
  const [memberCountError, setMemberCountError] = useState<string>();
  // 크루 소개
  const [catchphrase, setCatchphrase] = useState('');
  const [introText, setIntroText] = useState('');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [expertise, setExpertise] = useState<string[]>([]);
  // 활동 포트폴리오
  const [introFile, setIntroFile] = useState<string>(); // 소개 파일명(표시용)
  const [introFileData, setIntroFileData] = useState<{
    fileName: string;
    extension: string;
    size: number;
    url: string;
  }>(); // 저장용 파일 메타(업로드 완료)
  const [urlName, setUrlName] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  // 대표 프로젝트
  const [projects, setProjects] = useState<ProjectRowData[]>([]); // 후보 (백엔드 조회)
  const [picked, setPicked] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  // 등록 확인 팝업
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();

  // 기존 크루 프로필 조회 → 폼 채우기 (텍스트·이미지·링크만. 포트폴리오·대표프로젝트는 별도 연동 예정)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/crews/me');
        if (!res.ok) return;
        const data = await res.json();
        const p = data.payload;
        if (!p || cancelled) return;
        setCrewId(p.crewId);
        setCrewName(p.crewName ?? '');
        setCrewType(p.crewType ?? '');
        setActivity(p.activityField ?? '');
        setSchools(p.schools ?? []);
        setMemberCount(p.memberAmount != null ? String(p.memberAmount) : '');
        setCatchphrase(p.catchphrase ?? '');
        setIntroText(p.crewIntroduction ?? '');
        setStrengths(p.advantages ?? []);
        setExpertise(p.specialties ?? []);
        if (p.profileImage) {
          setProfileSrc(p.profileImage);
          setProfileImageUrl(p.profileImage);
        }
        const link = p.links?.[0];
        if (link) {
          setUrlName(link.name ?? '');
          setUrlValue(link.url ?? '');
        }
        const file = p.files?.[0];
        if (file) {
          setIntroFile(file.fileName);
          setIntroFileData({
            fileName: file.fileName,
            extension: file.extension ?? '',
            size: file.size ?? 0,
            url: file.url,
          });
        }
        setPortfolios(
          (p.portfolios ?? []).map(
            (pf: { id: number; imageLink?: string; name: string; fileLink?: string }) => ({
              id: String(pf.id),
              imageLink: pf.imageLink,
              name: pf.name,
              fileLink: pf.fileLink,
            }),
          ),
        );
      } catch {
        /* 조회 실패 시 빈 폼 유지 */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 대표 프로젝트 후보 조회 → 선택 테이블 + 이미 선택된 것(selected) 초기 반영
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/crews/me/representative-project-candidates?page=0&size=100');
        if (!res.ok) return;
        const data = await res.json();
        const content: Candidate[] = data.payload?.content ?? [];
        if (cancelled) return;
        setProjects(
          content.map((c) => ({
            id: String(c.projectId),
            name: c.projectName,
            brand: c.brandName,
            period: `${fmtDate(c.projectStartDate)}~${fmtDate(c.projectDeadline)}`,
            workType: labelOf(PROJECT_TYPE_OPTIONS, c.projectType),
            rating: 0,
          })),
        );
        setPicked(content.filter((c) => c.selected).map((c) => String(c.projectId)));
      } catch {
        /* 후보 조회 실패 시 빈 목록 유지 */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleProject(id: string) {
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev,
    );
  }

  // 체크한 항목(선택 순서)을 맨 앞으로 → 원래 어느 페이지에 있었든 1페이지 최상단에 노출
  const orderedProjects = useMemo(() => {
    const checkedFirst = picked
      .map((id) => projects.find((p) => p.id === id))
      .filter((p): p is ProjectRowData => Boolean(p));
    const rest = projects.filter((p) => !picked.includes(p.id));
    return [...checkedFirst, ...rest];
  }, [picked, projects]);
  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const pageProjects = orderedProjects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 등록 클릭 → 필수(크루명·크루유형·활동분야·멤버 인원수) 검증. 통과하면 확인 팝업
  function handleRegisterClick() {
    const nameInvalid = !crewName.trim();
    const typeInvalid = !crewType;
    const activityInvalid = !activity;
    const memberInvalid = !memberCount.trim();
    setCrewNameError(nameInvalid ? '크루명을 입력해 주세요' : undefined);
    setCrewTypeError(typeInvalid ? '크루 유형을 선택해 주세요' : undefined);
    setActivityError(activityInvalid ? '활동 분야를 선택해 주세요' : undefined);
    setMemberCountError(memberInvalid ? '멤버 인원수를 입력해 주세요' : undefined);
    if (nameInvalid || typeInvalid || activityInvalid || memberInvalid) return;
    setShowRegister(true);
  }

  // 프로필 등록하기 → PATCH /crews/me (텍스트·이미지·링크·강점·전문분야·학교·소개파일)
  //  + 대표 프로젝트 선택 저장(별도 PATCH). 포트폴리오는 별도 엔드포인트라 여기선 미포함.
  async function handleRegister() {
    try {
      const res = await fetch('/api/crews/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileImage: profileImageUrl,
          crewName,
          crewType,
          activityField: activity,
          schools,
          memberAmount: Number(memberCount) || 0,
          catchphrase,
          crewIntroduction: introText,
          advantages: strengths,
          specialties: expertise,
          links: urlValue ? [{ name: urlName, url: urlValue }] : [],
          files: introFileData ? [introFileData] : [],
        }),
      });
      if (!res.ok) throw new Error();
      // 대표 프로젝트 선택 저장 (선택 순서대로)
      const repRes = await fetch('/api/crews/me/representative-projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectIds: picked.map(Number) }),
      });
      if (!repRes.ok) throw new Error();
      setShowRegister(false);
      setToast({ message: '크루 프로필이 등록되었어요' });
    } catch {
      setShowRegister(false);
      setToast({ message: '프로필 저장에 실패했습니다. 다시 시도해 주세요.' });
    }
  }

  // 페이지에서 나가기 → 크루 프로필로 오기 직전 페이지로
  function handleLeave() {
    setShowRegister(false);
    router.back();
  }

  // 포트폴리오 추가/수정 — 새 파일은 업로드, 없으면 기존 URL 유지 → POST(신규)/PATCH(편집)
  async function handlePortfolioSubmit(draft: PortfolioDraft) {
    const editing = editingPortfolio;
    setShowPortfolioModal(false);
    setEditingPortfolio(null);
    try {
      const imageLink = draft.thumbnailFile
        ? (await uploadFile(draft.thumbnailFile)).fileUrl
        : draft.thumbnailUrl;
      const fileLink = draft.portfolioFile
        ? (await uploadFile(draft.portfolioFile)).fileUrl
        : draft.fileLink;
      const payload = { name: draft.name, imageLink, fileLink };
      const res = await fetch(
        editing ? `/api/crews/me/portfolio/${editing.id}` : '/api/crews/me/portfolio',
        {
          method: editing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error();
      const saved = (await res.json()).payload;
      const item: Portfolio = {
        id: String(saved.id),
        imageLink: saved.imageLink,
        name: saved.name,
        fileLink: saved.fileLink,
      };
      setPortfolios((prev) =>
        editing ? prev.map((p) => (p.id === editing.id ? item : p)) : [...prev, item],
      );
    } catch {
      setToast({ message: '포트폴리오 저장에 실패했습니다. 다시 시도해 주세요.' });
    }
  }

  // 포트폴리오 삭제 — ImageUploader onChange 로 사라진 항목을 즉시 DELETE (백엔드가 body 요구)
  function handlePortfolioChange(next: Portfolio[]) {
    const removed = portfolios.filter((p) => !next.some((n) => n.id === p.id));
    setPortfolios(next);
    removed.forEach((p) => {
      fetch(`/api/crews/me/portfolio/${p.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageLink: p.imageLink, name: p.name, fileLink: p.fileLink }),
      }).catch(() => {});
    });
  }

  return (
    <div className="w-[939px]">
      <PageIntro
        title="크루 프로필"
        subText="크루의 전문성과 프로젝트 경험을 기업에게 효과적으로 소개해 보세요."
        buttonLabel="프로필 등록"
        onButtonClick={handleRegisterClick}
      />

      {/* ── 기본 정보 ── */}
      <section className="mt-10 flex flex-col gap-6">
        <SectionTitle>기본 정보</SectionTitle>
        <ProfileImage
          src={profileSrc}
          seed={crewId}
          onSelect={async (f) => {
            setProfileSrc(URL.createObjectURL(f)); // 즉시 미리보기
            try {
              const { fileUrl } = await uploadFile(f); // presigned → S3 업로드
              setProfileImageUrl(fileUrl);
            } catch {
              setToast({ message: '이미지 업로드에 실패했습니다. 다시 시도해 주세요.' });
            }
          }}
          onRemove={() => {
            const removedSrc = profileSrc;
            const removedUrl = profileImageUrl;
            setProfileSrc(undefined);
            setProfileImageUrl(undefined);
            setToast({
              message: '프로필 이미지가 삭제되었습니다.',
              actionLabel: '되돌리기',
              onAction: () => {
                setProfileSrc(removedSrc);
                setProfileImageUrl(removedUrl);
                setToast(null);
              },
            });
          }}
        />
        <TextFieldLabeled
          id="crew-name"
          label="크루명"
          required
          value={crewName}
          onChange={(v) => {
            setCrewName(v);
            setCrewNameError(undefined);
          }}
          error={crewNameError}
        />
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-3">
            <FieldLabel required>크루 유형</FieldLabel>
            <DropdownForm
              options={CREW_TYPE_OPTIONS}
              value={crewType}
              onChange={(v) => {
                setCrewType(v);
                setCrewTypeError(undefined);
              }}
              error={crewTypeError}
            />
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <FieldLabel required>활동 분야</FieldLabel>
            <DropdownForm
              options={ACTIVITY_FIELD_OPTIONS}
              value={activity}
              onChange={(v) => {
                setActivity(v);
                setActivityError(undefined);
              }}
              error={activityError}
            />
          </div>
        </div>
        <TextFieldTagInput
          id="schools"
          label="소속 학교"
          value={schools}
          onChange={setSchools}
          placeholder="학교명을 입력해 태그로 추가하세요"
          showCount={false}
        />
        <TextFieldLabeled
          id="member-count"
          label="멤버 인원수"
          required
          value={memberCount ? `${memberCount}명` : ''}
          onChange={(v) => {
            setMemberCount(v.replace(/\D/g, ''));
            setMemberCountError(undefined);
          }}
          placeholder="0명"
          error={memberCountError}
        />
      </section>

      {/* ── 크루 소개 ── */}
      <section className="mt-16 flex flex-col gap-6">
        <SectionTitle>크루 소개</SectionTitle>
        <TextFieldLabeled
          id="catchphrase"
          label="캐치프라이즈"
          helperText="크루의 특징이 드러나는 짧은 소개 문구를 최대 30자로 작성해주세요"
          value={catchphrase}
          onChange={setCatchphrase}
          maxLength={30}
          hardMax={false}
          error={catchphrase.length > 30 ? '30자 이내로 적어주세요' : undefined}
        />
        <TextFieldLabeled
          id="intro-text"
          label="크루 소개글"
          value={introText}
          onChange={setIntroText}
          multiline
        />
        <TagSelectField
          id="strengths"
          label="핵심 강점"
          helperText="크루만의 차별화된 협업 방식과 강점을 키워드로 표현해보세요"
          value={strengths}
          onChange={setStrengths}
          options={STRENGTH_OPTIONS}
        />
        <TextFieldTagInput
          id="expertise"
          label="전문 분야"
          helperText="크루가 전문적으로 수행할 수 있는 분야를 최대 9개까지 등록해주세요"
          value={expertise}
          onChange={setExpertise}
          placeholder="내용을 입력해 태그로 추가하세요"
          showCount={false}
        />
      </section>

      {/* ── 활동 포트폴리오 ── */}
      <section className="mt-16 flex flex-col gap-6">
        <SectionTitle>활동 포트폴리오</SectionTitle>

        <TextFieldUpload
          id="intro-file"
          label="크루 소개 파일"
          fileName={introFile}
          accept=".pdf"
          onSelect={async (f) => {
            setIntroFile(f.name); // 즉시 파일명 표시
            try {
              const { fileUrl } = await uploadFile(f); // presigned → S3 업로드
              setIntroFileData({
                fileName: f.name,
                extension: f.name.split('.').pop() ?? '',
                size: f.size,
                url: fileUrl,
              });
            } catch {
              setToast({ message: '파일 업로드에 실패했습니다. 다시 시도해 주세요.' });
            }
          }}
          onRemove={() => {
            setIntroFile(undefined);
            setIntroFileData(undefined);
          }}
        />

        <div className="flex flex-col gap-3">
          <TextFieldUrl
            id="intro-link"
            label="크루 소개 링크"
            name={urlName}
            url={urlValue}
            onNameChange={setUrlName}
            onUrlChange={setUrlValue}
          />
        </div>

        <ImageUploader
          value={portfolios}
          onChange={handlePortfolioChange}
          onAdd={() => {
            setEditingPortfolio(null);
            setShowPortfolioModal(true);
          }}
          onEdit={(id) => {
            setEditingPortfolio(portfolios.find((p) => p.id === id) ?? null);
            setShowPortfolioModal(true);
          }}
        />

        {/* 대표 프로젝트 */}
        <div className="flex flex-col gap-3">
          <FieldLabel helperText="최대 3개까지 선택할 수 있으며, 선택한 순서대로 상세페이지에 표시됩니다.">
            대표 프로젝트
          </FieldLabel>
          <div>
            <div className="text-kor-label-1-semibold text-conx-gray-500 bg-conx-gray-50 border-conx-gray-150 flex items-center border-b py-3 pr-[11px] pl-[14px]">
              <span className={`${PROJECT_COLS.checkbox} shrink-0`} aria-hidden />
              <span className="ml-9 flex-1">프로젝트명</span>
              <span className={`ml-9 shrink-0 ${PROJECT_COLS.brand}`}>브랜드명</span>
              <span className={`ml-9 shrink-0 ${PROJECT_COLS.period}`}>실행 기간</span>
              <span className={`ml-9 shrink-0 ${PROJECT_COLS.chevron}`} aria-hidden />
            </div>
            {pageProjects.map((p) => (
              <ProjectRow
                key={p.id}
                {...p}
                checked={picked.includes(p.id)}
                disabled={!picked.includes(p.id) && picked.length >= 3}
                onCheck={() => toggleProject(p.id)}
                onDetailClick={() => {}}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      </section>

      {showPortfolioModal && (
        <PortfolioUploadModal
          initial={
            editingPortfolio
              ? {
                  name: editingPortfolio.name,
                  imageLink: editingPortfolio.imageLink,
                  fileLink: editingPortfolio.fileLink,
                }
              : undefined
          }
          onClose={() => {
            setShowPortfolioModal(false);
            setEditingPortfolio(null);
          }}
          onSubmit={handlePortfolioSubmit}
        />
      )}

      {showRegister && (
        <ProfileRegisterModal
          onRegister={handleRegister}
          onLeave={handleLeave}
          onClose={() => setShowRegister(false)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
