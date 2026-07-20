'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownForm } from '@/components/common/DropdownForm';
import { Pagination } from '@/components/common/Pagination';
import { Toast } from '@/components/common/Toast';
import ImageUploader from '@/components/mypage/ImageUploader';
import { type Portfolio } from '@/components/mypage/ImageUploaderInput';
import PageIntro from '@/components/mypage/PageIntro';
import PortfolioUploadModal from '@/components/mypage/PortfolioUploadModal';
import ProfileImage from '@/components/mypage/ProfileImage';
import ProfileRegisterModal from '@/components/mypage/ProfileRegisterModal';
import ProjectRow, { PROJECT_COLS } from '@/components/mypage/ProjectRow';
import TagSelectField, { type TagCategory } from '@/components/mypage/TagSelectField';
import TextFieldLabeled from '@/components/mypage/TextFieldLabeled';
import TextFieldTagInput from '@/components/mypage/TextFieldTagInput';
import TextFieldUpload from '@/components/mypage/TextFieldUpload';
import TextFieldUrl from '@/components/mypage/TextFieldUrl';

const CREW_TYPE_OPTIONS = [
  { value: 'academic', label: '학회' },
  { value: 'club', label: '동아리' },
  { value: 'council', label: '학생회' },
];
const FIELD_OPTIONS = [
  { value: 'marketing', label: '마케팅 · 광고' },
  { value: 'design', label: '디자인' },
  { value: 'strategy', label: '전략 컨설팅' },
  { value: 'finance', label: '금융' },
  { value: 'startup', label: '창업' },
  { value: 'dev', label: '개발 · IT' },
  { value: 'art', label: '공연 · 예술' },
  { value: 'sports', label: '스포츠' },
  { value: 'volunteer', label: '봉사' },
];

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
const PROJECTS = Array.from({ length: 23 }, (_, i) => ({
  id: `pj${i}`,
  name: '프로젝트명',
  brand: '브랜드명',
  period: '2000.00.00~2000.00.00',
  workType: '프로젝트 목적',
  rating: 0,
}));

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-kor-heading-2-bold text-conx-common-black">{children}</h2>;
}

// 외부에서 라벨을 그릴 때(드롭다운 등)용 라벨 블록
function FieldLabel({
  children,
  required,
  helperText,
  htmlFor,
}: {
  children: React.ReactNode;
  required?: boolean;
  helperText?: string;
  htmlFor?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <label htmlFor={htmlFor} className="text-kor-label-1-medium text-conx-gray-350">
        {children}
        {required && <span className="text-conx-red-500 ml-0.5">*</span>}
      </label>
      {helperText && <p className="text-kor-label-1-medium text-conx-gray-450">{helperText}</p>}
    </div>
  );
}

export default function CrewProfilePage() {
  // 기본 정보
  const [profileSrc, setProfileSrc] = useState<string>();
  const [toast, setToast] = useState<{
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);
  const [crewName, setCrewName] = useState('CEOS 세로스');
  const [crewType, setCrewType] = useState('');
  const [activity, setActivity] = useState('');
  const [schools, setSchools] = useState<string[]>([]);
  const [memberCount, setMemberCount] = useState('7');
  // 크루 소개
  const [catchphrase, setCatchphrase] = useState('');
  const [introText, setIntroText] = useState('');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [expertise, setExpertise] = useState<string[]>([]);
  // 활동 포트폴리오
  const [introFile, setIntroFile] = useState<string>();
  const [urlName, setUrlName] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  // 대표 프로젝트
  const [picked, setPicked] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  // 등록 확인 팝업
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();

  function toggleProject(id: string) {
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev,
    );
  }

  // 체크한 항목(선택 순서)을 맨 앞으로 → 원래 어느 페이지에 있었든 1페이지 최상단에 노출
  const orderedProjects = useMemo(() => {
    const checkedFirst = picked
      .map((id) => PROJECTS.find((p) => p.id === id))
      .filter((p): p is (typeof PROJECTS)[number] => Boolean(p));
    const rest = PROJECTS.filter((p) => !picked.includes(p.id));
    return [...checkedFirst, ...rest];
  }, [picked]);
  const totalPages = Math.ceil(PROJECTS.length / PAGE_SIZE);
  const pageProjects = orderedProjects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 프로필 등록하기 → (API 연동 예정) 등록 후 토스트
  function handleRegister() {
    const payload = {
      profileImage: profileSrc,
      crewName,
      crewType,
      activity,
      schools,
      memberCount: Number(memberCount) || 0,
      catchphrase,
      introText,
      strengths,
      expertise,
      introFile,
      url: { name: urlName, value: urlValue },
      portfolios,
      representativeProjects: picked, // 체크한 대표 프로젝트 (선택 순서)
    };
    // TODO: 실제 등록 API 연동
    console.log('크루 프로필 등록', payload);
    setShowRegister(false);
    setToast({ message: '크루 프로필이 등록되었어요' });
  }

  // 페이지에서 나가기 → 크루 프로필로 오기 직전 페이지로
  function handleLeave() {
    setShowRegister(false);
    router.back();
  }

  return (
    <div className="w-[939px]">
      <PageIntro
        title="크루 프로필"
        subText="크루의 전문성과 프로젝트 경험을 기업에게 효과적으로 소개해 보세요."
        buttonLabel="프로필 등록"
        onButtonClick={() => setShowRegister(true)}
      />

      {/* ── 기본 정보 ── */}
      <section className="mt-10 flex flex-col gap-6">
        <SectionTitle>기본 정보</SectionTitle>
        <ProfileImage
          src={profileSrc}
          onSelect={(f) => setProfileSrc(URL.createObjectURL(f))}
          onRemove={() => {
            const removed = profileSrc;
            setProfileSrc(undefined);
            setToast({
              message: '프로필 이미지가 삭제되었습니다.',
              actionLabel: '되돌리기',
              onAction: () => {
                setProfileSrc(removed);
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
          onChange={setCrewName}
        />
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-3">
            <FieldLabel required>크루 유형</FieldLabel>
            <DropdownForm options={CREW_TYPE_OPTIONS} value={crewType} onChange={setCrewType} />
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <FieldLabel required>활동 분야</FieldLabel>
            <DropdownForm options={FIELD_OPTIONS} value={activity} onChange={setActivity} />
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
          onChange={(v) => setMemberCount(v.replace(/\D/g, ''))}
          placeholder="0명"
        />
      </section>

      {/* ── 크루 소개 ── */}
      <section className="mt-16 flex flex-col gap-6">
        <SectionTitle>크루 소개</SectionTitle>
        <TextFieldLabeled
          id="catchphrase"
          label="캐치프라이즈"
          helperText="서비스 특성이 드러나는 짧고 자유로운 한 문장을 30자 이내로 써주세요"
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
          helperText="선택하거나 직접 입력해 태그로 자유롭게 표현하세요"
          value={strengths}
          onChange={setStrengths}
          options={STRENGTH_OPTIONS}
        />
        <TextFieldTagInput
          id="expertise"
          label="전문 분야"
          helperText="크루가 전문성을 가졌다고 생각하는 분야를 태그로 표현하세요"
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
          onSelect={(f) => setIntroFile(f.name)}
          onRemove={() => setIntroFile(undefined)}
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
          onChange={setPortfolios}
          onAdd={() => setShowPortfolioModal(true)}
          onEdit={() => setShowPortfolioModal(true)}
        />

        {/* 대표 프로젝트 */}
        <div className="flex flex-col gap-3">
          <FieldLabel helperText="최대 3개까지 선택할 수 있으며, 선택한 순서대로 상세페이지에 표시됩니다.">
            대표 프로젝트
          </FieldLabel>
          <div>
            {/* 헤더행 — bg gray-50 / 하단보더 gray-150 / 텍스트 gray-500 (Label1 Semibold) */}
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
          onClose={() => setShowPortfolioModal(false)}
          onSubmit={(d) => {
            setPortfolios((prev) => [...prev, { id: `p${prev.length}`, name: d.name }]);
            setShowPortfolioModal(false);
          }}
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
