export const INDUSTRY = {
  BEAUTY: 'BEAUTY',
  FASHION: 'FASHION',
  IT: 'IT',
  CAREER: 'CAREER',
  FANDB: 'FANDB',
  LIFESTYLE: 'LIFESTYLE',
  ENTERTAIN: 'ENTERTAIN',
  ETC: 'ETC',
} as const;

export type Industry = (typeof INDUSTRY)[keyof typeof INDUSTRY];

export const INDUSTRY_OPTIONS = [
  { value: INDUSTRY.BEAUTY, label: '뷰티' },
  { value: INDUSTRY.FASHION, label: '패션' },
  { value: INDUSTRY.IT, label: 'IT/서비스' },
  { value: INDUSTRY.CAREER, label: '진로' },
  { value: INDUSTRY.FANDB, label: 'F&B' },
  { value: INDUSTRY.LIFESTYLE, label: '라이프스타일' },
  { value: INDUSTRY.ENTERTAIN, label: '엔터테인먼트' },
  { value: INDUSTRY.ETC, label: '기타' },
];

export const PROJECT_TYPE_OPTIONS = [
  { value: 'side-project', label: '사이드 프로젝트' },
  { value: 'competition', label: '공모전' },
  { value: 'study', label: '스터디' },
  { value: 'internship', label: '인턴십' },
];

export const CREW_TYPE_OPTIONS = [
  { value: 'ACADEMY', label: '학회' },
  { value: 'CLUB', label: '동아리' },
  { value: 'SMALLMEETING', label: '소모임' },
  { value: 'COUNCIL', label: '학생회' },
  { value: 'ETC', label: '기타' },
];

export const RATING_OPTIONS = [
  { value: '5', label: '5점 이상' },
  { value: '4', label: '4점 이상' },
  { value: '3', label: '3점 이상' },
  { value: '2', label: '2점 이상' },
  { value: '1', label: '1점 이상' },
  { value: '0', label: '0점 이상' },
];

export const SORT_OPTIONS = [
  { value: 'latest', label: '최신등록순' },
  { value: 'recommended', label: '추천순' },
  { value: 'popular', label: '인기순' },
];
