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
  { value: 'RESEARCH', label: '리서치/인사이트' },
  { value: 'MARKETING', label: '마케팅 전략/기획' },
  { value: 'UGC', label: '숏폼/UGC' },
  { value: 'SAMPLING', label: '샘플링/오프라인' },
  { value: 'CAMPAIGN', label: '브랜드 캠페인/프로모션' },
  { value: 'APPTEST', label: '앱/서비스 테스트' },
  { value: 'COALITION', label: '학생회/동아리 제휴' },
  { value: 'ETC', label: '기타' },
];

export const CREW_TYPE_OPTIONS = [
  { value: 'ACADEMY', label: '학회' },
  { value: 'CLUB', label: '동아리' },
  { value: 'SMALLMEETING', label: '소모임' },
  { value: 'COUNCIL', label: '학생회' },
];

export const ACTIVITY_FIELD_OPTIONS = [
  { value: 'MARKETING', label: '마케팅' },
  { value: 'DESIGN', label: '디자인' },
  { value: 'BUSINESS', label: '경영·컨설팅' },
  { value: 'FINANCE', label: '금융' },
  { value: 'STARTUP', label: '창업' },
  { value: 'DEV_IT', label: '개발·IT' },
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
  { value: 'RECENT', label: '최신등록순' },
  { value: 'RECOMMENDED', label: '추천순' },
  { value: 'POPULAR', label: '인기순' },
  { value: 'RATING', label: '평점순' },
];
