// 크루 프로젝트 이력 — 상세 사이드바(최대 3개) / 프로젝트 이력 페이지(8개/페이지) 공용

export type ProjectStatus = '진행 중' | '완료';

export interface CrewProject {
  name: string;
  brand: string;
  // 결과물별 플랫폼·콘텐츠 유형 목록 (등록 페이지에서 여러 개 입력 가능)
  outputs: { platform: string; contentType: string }[];
  rating: number;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
}

// 작업 유형 표시 문자열: '플랫폼·콘텐츠 유형' (+ 여러 개면 '외 n개')
export function formatWorkType(outputs: CrewProject['outputs']): string {
  if (outputs.length === 0) return '';
  const [first] = outputs;
  const base = `${first.platform}·${first.contentType}`;
  return outputs.length > 1 ? `${base} 외 ${outputs.length - 1}개` : base;
}

// placeholder — TODO: crewId로 실제 조회. 배열 순서 = 최신 등록순
// 상세 사이드바는 앞 3개만, 이력 페이지는 전체(8개/페이지)
export const CREW_PROJECTS: CrewProject[] = [
  { name: '여름 시즌 숏폼 콘텐츠 제작', brand: '오브제 스튜디오', outputs: [{ platform: '인스타그램', contentType: '릴스' }, { platform: '유튜브', contentType: '쇼츠' }], rating: 4.2, startDate: '2000.00.00', endDate: '2000.00.00', status: '진행 중' }, // prettier-ignore
  { name: '프로젝트명', brand: '브랜드명', outputs: [{ platform: '플랫폼명', contentType: '콘텐츠 유형' }], rating: 4.8, startDate: '2000.00.00', endDate: '2000.00.00', status: '완료' }, // prettier-ignore
  { name: '프로젝트명', brand: '브랜드명', outputs: [{ platform: '플랫폼명', contentType: '콘텐츠 유형' }], rating: 3.5, startDate: '2000.00.00', endDate: '2000.00.00', status: '완료' }, // prettier-ignore
  { name: '프로젝트명', brand: '브랜드명', outputs: [{ platform: '플랫폼명', contentType: '콘텐츠 유형' }], rating: 5.0, startDate: '2000.00.00', endDate: '2000.00.00', status: '완료' }, // prettier-ignore
  { name: '프로젝트명', brand: '브랜드명', outputs: [{ platform: '플랫폼명', contentType: '콘텐츠 유형' }], rating: 4.0, startDate: '2000.00.00', endDate: '2000.00.00', status: '완료' }, // prettier-ignore
  { name: '프로젝트명', brand: '브랜드명', outputs: [{ platform: '플랫폼명', contentType: '콘텐츠 유형' }], rating: 4.5, startDate: '2000.00.00', endDate: '2000.00.00', status: '완료' }, // prettier-ignore
  { name: '프로젝트명', brand: '브랜드명', outputs: [{ platform: '플랫폼명', contentType: '콘텐츠 유형' }], rating: 3.8, startDate: '2000.00.00', endDate: '2000.00.00', status: '완료' }, // prettier-ignore
  { name: '프로젝트명', brand: '브랜드명', outputs: [{ platform: '플랫폼명', contentType: '콘텐츠 유형' }], rating: 4.9, startDate: '2000.00.00', endDate: '2000.00.00', status: '완료' }, // prettier-ignore
  { name: '프로젝트명', brand: '브랜드명', outputs: [{ platform: '플랫폼명', contentType: '콘텐츠 유형' }], rating: 4.1, startDate: '2000.00.00', endDate: '2000.00.00', status: '완료' }, // prettier-ignore
  { name: '프로젝트명', brand: '브랜드명', outputs: [{ platform: '플랫폼명', contentType: '콘텐츠 유형' }], rating: 3.2, startDate: '2000.00.00', endDate: '2000.00.00', status: '완료' }, // prettier-ignore
];
