import {
  HeroSection,
  IntroSection,
  BrowseSection,
  ProcessSection,
  FeaturesSection,
  CtaSection,
} from '@/components/home/sections';
import { BACKEND_ENDPOINTS } from '@/constants/api';
import {
  ACTIVITY_FIELD_OPTIONS,
  CREW_TYPE_OPTIONS,
  INDUSTRY_OPTIONS,
  PROJECT_TYPE_OPTIONS,
} from '@/constants/browse';

const API_BASE_URL = process.env.API_BASE_URL;
const FALLBACK_IMG = '/images/OG_image.png';

// enum → 한글 라벨 (없으면 원본값 그대로)
function labelOf(options: { value: string; label: string }[], value: string | null): string {
  if (!value) return '';
  return options.find((o) => o.value === value)?.label ?? value;
}
const fmtDate = (s: string) => s.replace(/-/g, '.');

// 백엔드 목록 응답 (미리보기에 쓰는 필드만)
interface RawProject {
  projectId: number;
  projectImage: string[] | null;
  projectName: string;
  companyName: string | null;
  category: string;
  projectType: string;
  projectStartDate: string;
  projectDeadline: string;
}
interface RawCrew {
  crewId: number;
  profileImage: string | null;
  crewName: string | null;
  crewIntroduction: string | null;
  category: string | null;
  crewType: string | null;
  point: number;
  cumulative: number;
}

// 목록 최신 5개 조회 (실패 시 빈 배열 → 섹션은 '더보기'만 노출)
async function fetchContent<T>(endpoint: string): Promise<T[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}?page=0&size=5&sort=RECENT`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return res.ok && data.payload?.content ? data.payload.content : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [rawProjects, rawCrews] = await Promise.all([
    fetchContent<RawProject>(BACKEND_ENDPOINTS.PROJECT.LIST),
    fetchContent<RawCrew>(BACKEND_ENDPOINTS.CREW.LIST),
  ]);

  const projects = rawProjects.map((p) => ({
    id: p.projectId,
    imageSrc: p.projectImage?.[0] || FALLBACK_IMG,
    imageAlt: p.projectName,
    title: p.projectName,
    subtitle: p.companyName ?? '',
    category1: labelOf(INDUSTRY_OPTIONS, p.category),
    category2: labelOf(PROJECT_TYPE_OPTIONS, p.projectType),
    startDate: fmtDate(p.projectStartDate),
    endDate: fmtDate(p.projectDeadline),
  }));

  const crews = rawCrews.map((c) => ({
    id: c.crewId,
    imageSrc: c.profileImage || FALLBACK_IMG,
    imageAlt: c.crewName ?? '크루 이미지',
    title: c.crewName ?? '크루명',
    subtitle: c.crewIntroduction ?? '',
    category1: labelOf(ACTIVITY_FIELD_OPTIONS, c.category),
    category2: labelOf(CREW_TYPE_OPTIONS, c.crewType),
    rating: c.point,
    totalCount: c.cumulative,
  }));

  return (
    <>
      <HeroSection />
      <IntroSection />
      <BrowseSection projects={projects} crews={crews} />
      <ProcessSection />
      <FeaturesSection />
      <CtaSection />
    </>
  );
}
