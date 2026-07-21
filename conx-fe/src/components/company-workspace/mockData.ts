import type { StatusCardData, WorkspaceTask } from '@/types/workspace';

export const COMPANY_STATUS_CARDS: StatusCardData[] = [
  { tagType: 'blue', tagLabel: '모집 중', count: 12 },
  { tagType: 'green', tagLabel: '진행 중', count: 3 },
  { tagType: 'purple', tagLabel: '검수 대기', count: 4 },
  { tagType: 'cyan', tagLabel: '정산 대기', count: 5 },
  { tagType: 'gray', tagLabel: '정산 완료', count: 678 },
];

export interface MonthlySpending {
  month: string;
  amount: number;
}

export const MONTHLY_SPENDINGS: MonthlySpending[] = [
  { month: '1월', amount: 100 },
  { month: '2월', amount: 100 },
  { month: '3월', amount: 100 },
  { month: '4월', amount: 100 },
  { month: '5월', amount: 100 },
  { month: '6월', amount: 100 },
  { month: '7월', amount: 100 },
  { month: '8월', amount: 100 },
  { month: '9월', amount: 100 },
  { month: '10월', amount: 100 },
  { month: '11월', amount: 100 },
  { month: '12월', amount: 100 },
];

export const COMPANY_SPENDING = {
  amount: '1,250,000',
  message: '지금까지 지출한 금액이에요!',
};

// === 빈 상태 ===

export const EMPTY_COMPANY_STATUS_CARDS: StatusCardData[] = COMPANY_STATUS_CARDS.map((c) => ({
  ...c,
  count: 0,
}));

export const EMPTY_MONTHLY_SPENDINGS: MonthlySpending[] = MONTHLY_SPENDINGS.map((s) => ({
  ...s,
  amount: 0,
}));

export const EMPTY_COMPANY_SPENDING = {
  amount: '0',
  message: '크루를 모집하고 프로젝트를 시작해보세요!',
};

// === 프로젝트 현황 탭 ===

export const COMPANY_PROJECT_TAB_COUNTS = [
  { label: '전체', count: 12 },
  { label: '모집 중', count: 2 },
  { label: '진행 중', count: 1 },
  { label: '검수 대기', count: 1 },
  { label: '정산 대기', count: 1 },
  { label: '정산 완료', count: 6 },
];

const COMPANY_TAG_MAP: Record<string, { type: string; label: string }> = {
  '모집 중': { type: 'blue', label: '모집 중' },
  진행중: { type: 'green', label: '진행 중' },
  '검수 대기': { type: 'purple', label: '검수 대기' },
  '정산 대기': { type: 'cyan', label: '정산 대기' },
  '정산 완료': { type: 'gray', label: '정산 완료' },
};

export const COMPANY_PROJECT_CARDS = [
  {
    id: '1',
    status: '모집 중',
    dDay: 12,
    title: 'F&B 신제품 캠퍼스 숏폼 프로젝트',
    brand: 'Sparkle Drink',
    category1: 'F&B',
    category2: '숏폼·UGC',
    startDate: '2025.05.10',
    endDate: '2025.05.28',
  },
  {
    id: '2',
    status: '모집 중',
    dDay: 12,
    title: 'F&B 신제품 캠퍼스 숏폼 프로젝트',
    brand: 'Sparkle Drink',
    category1: 'F&B',
    category2: '숏폼·UGC',
    startDate: '2025.05.10',
    endDate: '2025.05.28',
  },
  {
    id: '3',
    status: '진행중',
    title: 'F&B 신제품 캠퍼스 숏폼 프로젝트',
    brand: 'Sparkle Drink',
    category1: 'F&B',
    category2: '숏폼·UGC',
    startDate: '2025.05.10',
    endDate: '2025.05.28',
  },
  {
    id: '4',
    status: '검수 대기',
    title: 'F&B 신제품 캠퍼스 숏폼 프로젝트',
    brand: 'Sparkle Drink',
    category1: 'F&B',
    category2: '숏폼·UGC',
    startDate: '2025.05.10',
    endDate: '2025.05.28',
  },
  {
    id: '5',
    status: '정산 대기',
    title: 'F&B 신제품 캠퍼스 숏폼 프로젝트',
    brand: 'Sparkle Drink',
    category1: 'F&B',
    category2: '숏폼·UGC',
    startDate: '2025.05.10',
    endDate: '2025.05.28',
  },
  {
    id: '6',
    status: '정산 완료',
    title: 'F&B 신제품 캠퍼스 숏폼 프로젝트',
    brand: 'Sparkle Drink',
    category1: 'F&B',
    category2: '숏폼·UGC',
    startDate: '2025.05.10',
    endDate: '2025.05.28',
  },
  {
    id: '7',
    status: '정산 완료',
    title: 'F&B 신제품 캠퍼스 숏폼 프로젝트',
    brand: 'Sparkle Drink',
    category1: 'F&B',
    category2: '숏폼·UGC',
    startDate: '2025.05.10',
    endDate: '2025.05.28',
  },
  {
    id: '8',
    status: '정산 완료',
    title: 'F&B 신제품 캠퍼스 숏폼 프로젝트',
    brand: 'Sparkle Drink',
    category1: 'F&B',
    category2: '숏폼·UGC',
    startDate: '2025.05.10',
    endDate: '2025.05.28',
  },
  {
    id: '9',
    status: '정산 완료',
    title: 'F&B 신제품 캠퍼스 숏폼 프로젝트',
    brand: 'Sparkle Drink',
    category1: 'F&B',
    category2: '숏폼·UGC',
    startDate: '2025.05.10',
    endDate: '2025.05.28',
  },
  {
    id: '10',
    status: '정산 완료',
    title: 'F&B 신제품 캠퍼스 숏폼 프로젝트',
    brand: 'Sparkle Drink',
    category1: 'F&B',
    category2: '숏폼·UGC',
    startDate: '2025.05.10',
    endDate: '2025.05.28',
  },
  {
    id: '11',
    status: '정산 완료',
    title: 'F&B 신제품 캠퍼스 숏폼 프로젝트',
    brand: 'Sparkle Drink',
    category1: 'F&B',
    category2: '숏폼·UGC',
    startDate: '2025.05.10',
    endDate: '2025.05.28',
  },
  {
    id: '12',
    status: '정산 완료',
    title: 'F&B 신제품 캠퍼스 숏폼 프로젝트',
    brand: 'Sparkle Drink',
    category1: 'F&B',
    category2: '숏폼·UGC',
    startDate: '2025.05.10',
    endDate: '2025.05.28',
  },
];

export function getCompanyProjectTag(status: string) {
  return COMPANY_TAG_MAP[status] ?? { type: 'gray', label: status };
}

// === 정산 관리 ===

export const COMPANY_SETTLEMENT_SUMMARY = [
  { title: '누적 지원금', value: '10,000,000', description: '2000.00.00 기준', width: 'w-114.25' },
  {
    title: '지급 예정',
    value: '10,000,000',
    description: '다음 지급 예정일: 2026.07.15',
    width: 'w-84.25',
  },
  { title: '이번 달 지원금', value: '10,000,000', description: '2000.00 기준', width: 'w-84.25' },
];

export const COMPANY_SETTLEMENT_ROWS = [
  {
    id: '1',
    status: 'pending' as const,
    amount: '1,000,000',
    project: '제목',
    crew: '이름',
    date: '-',
  },
  {
    id: '2',
    status: 'pending' as const,
    amount: '1,000,000',
    project: '제목',
    crew: '이름',
    date: '-',
  },
  {
    id: '3',
    status: 'pending' as const,
    amount: '1,000,000',
    project: '제목',
    crew: '이름',
    date: '-',
  },
  {
    id: '4',
    status: 'pending' as const,
    amount: '1,000,000',
    project: '제목',
    crew: '이름',
    date: '-',
  },
  {
    id: '5',
    status: 'pending' as const,
    amount: '1,000,000',
    project: '제목',
    crew: '이름',
    date: '-',
  },
  {
    id: '6',
    status: 'completed' as const,
    amount: '10,000',
    project: '제목',
    crew: '이름',
    date: '2000.00.00',
  },
  {
    id: '7',
    status: 'completed' as const,
    amount: '10,000',
    project: '제목',
    crew: '이름',
    date: '2000.00.00',
  },
  {
    id: '8',
    status: 'completed' as const,
    amount: '10,000',
    project: '제목',
    crew: '이름',
    date: '2000.00.00',
  },
  {
    id: '9',
    status: 'completed' as const,
    amount: '10,000',
    project: '제목',
    crew: '이름',
    date: '2000.00.00',
  },
];

// === 파트너 크루 ===

const PARTNER_CREW_TAG_MAP: Record<string, { type: string; label: string }> = {
  '매칭 전': { type: 'blue', label: '매칭 전' },
  '진행 중': { type: 'green', label: '진행 중' },
  '정산 완료': { type: 'gray', label: '정산 완료' },
};

export function getPartnerCrewTag(status: string) {
  return PARTNER_CREW_TAG_MAP[status] ?? { type: 'gray', label: status };
}

export const PARTNER_CREW_CARDS = [
  {
    id: '1',
    status: '매칭 전',
    name: 'CEOS 세오스',
    catchphrase: '"신촌권 원앤온리 IT 창업 동아리"',
    field: 'IT',
    crewType: '동아리',
    rating: 5.0,
    totalCount: 2323,
  },
  {
    id: '2',
    status: '매칭 전',
    name: '크루명',
    catchphrase: '캐치프레이즈',
    field: '활동 분야',
    crewType: '크루 유형',
    rating: 0.0,
    totalCount: 0,
  },
  {
    id: '3',
    status: '진행 중',
    name: '크루명',
    catchphrase: '캐치프레이즈',
    field: '활동 분야',
    crewType: '크루 유형',
    rating: 0.0,
    totalCount: 0,
  },
  {
    id: '4',
    status: '진행 중',
    name: '크루명',
    catchphrase: '캐치프레이즈',
    field: '활동 분야',
    crewType: '크루 유형',
    rating: 0.0,
    totalCount: 0,
  },
  {
    id: '5',
    status: '진행 중',
    name: '크루명',
    catchphrase: '캐치프레이즈',
    field: '활동 분야',
    crewType: '크루 유형',
    rating: 0.0,
    totalCount: 0,
  },
  {
    id: '6',
    status: '정산 완료',
    name: '크루명',
    catchphrase: '캐치프레이즈',
    field: '활동 분야',
    crewType: '크루 유형',
    rating: 0.0,
    totalCount: 0,
  },
  {
    id: '7',
    status: '정산 완료',
    name: '크루명',
    catchphrase: '캐치프레이즈',
    field: '활동 분야',
    crewType: '크루 유형',
    rating: 0.0,
    totalCount: 0,
  },
  {
    id: '8',
    status: '정산 완료',
    name: '크루명',
    catchphrase: '캐치프레이즈',
    field: '활동 분야',
    crewType: '크루 유형',
    rating: 0.0,
    totalCount: 0,
  },
  {
    id: '9',
    status: '정산 완료',
    name: '크루명',
    catchphrase: '캐치프레이즈',
    field: '활동 분야',
    crewType: '크루 유형',
    rating: 0.0,
    totalCount: 0,
  },
  {
    id: '10',
    status: '정산 완료',
    name: '크루명',
    catchphrase: '캐치프레이즈',
    field: '활동 분야',
    crewType: '크루 유형',
    rating: 0.0,
    totalCount: 0,
  },
  {
    id: '11',
    status: '정산 완료',
    name: '크루명',
    catchphrase: '캐치프레이즈',
    field: '활동 분야',
    crewType: '크루 유형',
    rating: 0.0,
    totalCount: 0,
  },
  {
    id: '12',
    status: '정산 완료',
    name: '크루명',
    catchphrase: '캐치프레이즈',
    field: '활동 분야',
    crewType: '크루 유형',
    rating: 0.0,
    totalCount: 0,
  },
];

// === 프로젝트 상세 ===

export interface CompanyCrewApplication {
  id: string;
  crewId: string;
  profileSrc: string;
  name: string;
  subtitle: string;
  tags: string[];
  motivation: string;
}

export interface MatchedCrew {
  crewId: string;
  profileSrc: string;
  name: string;
  subtitle: string;
}

export interface CompanyProjectDetail {
  projectTitle: string;
  brandName: string;
  managerName: string;
  email: string;
  projectId: string;
  fundingAmount: string;
  progressSteps: {
    label: string;
    date?: string;
    type: 'completed' | 'inProgress' | 'notStarted';
  }[];
  submissionCriteria: { label: string; checked: boolean }[];
  matchedCrew?: MatchedCrew;
  settlementStatus?: string;
  settlementAmount?: string;
  results?: import('@/types/workspace').ResultItem[];
  crewApplications: CompanyCrewApplication[];
}

const SAMPLE_MOTIVATION =
  '프로젝트 목표가 단순 노출보다 실제 사용자 반응 수집과 콘텐츠 제작에 집중되어 있어 지원했습니다. 대학생 타깃 대상 콘텐츠 기획 및 운영 경험을 바탕으로, 자연스럽게 제품을 경험하는 상황 중심의 콘텐츠를 제작하고 실제 참여자 반응까지 정리해 전달할 수 있습니다.';

export const COMPANY_PROJECT_DETAIL_MOCK: CompanyProjectDetail = {
  projectTitle: '프로젝트 제목이 들어갈 자리입니다.',
  brandName: 'CONX',
  managerName: '김담당자',
  email: 'abcdefg@gmail.com',
  projectId: 'p1',
  fundingAmount: '500,000',
  progressSteps: [
    { label: '매칭 완료', date: '2025.05.10', type: 'completed' },
    { label: '진행 중', date: '2000.00.00', type: 'inProgress' },
    { label: '진행 완료', date: '2000.00.00 예정', type: 'notStarted' },
    { label: '제출 완료', date: '2000.00.00 예정', type: 'notStarted' },
    { label: '정산 완료', type: 'notStarted' },
  ],
  submissionCriteria: [
    { label: '숏폼 원본 파일', checked: true },
    { label: '숏폼 업로드 링크', checked: true },
    { label: '조회수/댓글 수 등 정량 지표 포함', checked: false },
    { label: '실행 회고 및 인사이트 작성', checked: false },
  ],
  crewApplications: Array.from({ length: 6 }, (_, i) => ({
    id: `crew-${i + 1}`,
    crewId: `${i + 1}`,
    profileSrc: '/placeholder.png',
    name: 'CEOS',
    subtitle: 'IT 창업 동아리',
    tags: ['마케팅', '디자인', '창업'],
    motivation: SAMPLE_MOTIVATION,
  })),
};

export const COMPANY_PROJECT_MATCHED_EMPTY_MOCK: CompanyProjectDetail = {
  projectTitle: '프로젝트 제목이 들어갈 자리입니다.',
  brandName: 'CONX',
  managerName: '김담당자',
  email: 'abcdefg@gmail.com',
  projectId: 'p3',
  fundingAmount: '500,000',
  progressSteps: [
    { label: '매칭 완료', date: '2025.05.10', type: 'completed' },
    { label: '진행 중', date: '2000.00.00 예정', type: 'notStarted' },
    { label: '진행 완료', date: '2000.00.00 예정', type: 'notStarted' },
    { label: '제출 완료', date: '2000.00.00 예정', type: 'notStarted' },
    { label: '정산 완료', type: 'notStarted' },
  ],
  submissionCriteria: [
    { label: '숏폼 원본 파일', checked: false },
    { label: '숏폼 업로드 링크', checked: false },
    { label: '조회수/댓글 수 등 정량 지표 포함', checked: false },
    { label: '실행 회고 및 인사이트 작성', checked: false },
  ],
  matchedCrew: {
    crewId: '1',
    profileSrc: '/placeholder.png',
    name: 'CEOS',
    subtitle: 'IT 창업 동아리',
  },
  settlementStatus: 'pending',
  settlementAmount: '500,000',
  results: [],
  crewApplications: [],
};

export const COMPANY_PROJECT_MATCHED_MOCK: CompanyProjectDetail = {
  projectTitle: '프로젝트 제목이 들어갈 자리입니다.',
  brandName: 'CONX',
  managerName: '김담당자',
  email: 'abcdefg@gmail.com',
  projectId: 'p2',
  fundingAmount: '500,000',
  progressSteps: [
    { label: '매칭 완료', date: '2025.05.10', type: 'completed' },
    { label: '진행 중', date: '2000.00.00', type: 'inProgress' },
    { label: '진행 완료', date: '2000.00.00 예정', type: 'notStarted' },
    { label: '제출 완료', date: '2000.00.00 예정', type: 'notStarted' },
    { label: '정산 완료', type: 'notStarted' },
  ],
  submissionCriteria: [
    { label: '숏폼 원본 파일', checked: true },
    { label: '숏폼 업로드 링크', checked: true },
    { label: '조회수/댓글 수 등 정량 지표 포함', checked: false },
    { label: '실행 회고 및 인사이트 작성', checked: false },
  ],
  matchedCrew: {
    crewId: '1',
    profileSrc: '/placeholder.png',
    name: 'CEOS',
    subtitle: 'IT 창업 동아리',
  },
  settlementStatus: 'pending',
  settlementAmount: '500,000',
  results: [
    {
      id: '1',
      indicatorType: 'blue',
      indicatorLabel: '답변 전',
      title: '1차 숏폼 콘텐츠 결과물 공유드립니다.',
      author: '이름',
      registeredDate: '2025.05.10',
      content:
        '안녕하세요.\n\n요청해 주신 1차 숏폼 콘텐츠 결과물을 업로드했습니다.\n\n제품의 핵심 특징이 자연스럽게 전달될 수 있도록 초반 구성과 자막 흐름을 중심으로 제작했습니다.\n\n검토 후 수정이 필요한 사항이 있다면 피드백 부탁드립니다.\n의견을 반영하여 다음 결과물에 빠르게 적용하겠습니다.\n\n감사합니다.',
      files: [
        { name: '파일명(확장자명, 용량)', description: '입력 완료 정보' },
        { name: '파일명(확장자명, 용량)' },
      ],
      links: [
        { label: '브랜드 홈페이지', url: 'https://', description: '입력 완료 정보' },
        { label: '브랜드 인스타그램 계정', url: 'https://' },
      ],
    },
    {
      id: '2',
      indicatorType: 'gray',
      indicatorLabel: '답변 완료',
      title: '1차 숏폼 콘텐츠 결과물 공유드립니다.',
      author: '이름',
      registeredDate: '2025.05.10',
      content:
        '안녕하세요.\n\n요청해 주신 1차 숏폼 콘텐츠 결과물을 업로드했습니다.\n\n제품의 핵심 특징이 자연스럽게 전달될 수 있도록 초반 구성과 자막 흐름을 중심으로 제작했습니다.\n\n검토 후 수정이 필요한 사항이 있다면 피드백 부탁드립니다.\n의견을 반영하여 다음 결과물에 빠르게 적용하겠습니다.\n\n감사합니다.',
      files: [
        { name: '파일명(확장자명, 용량)', description: '입력 완료 정보' },
        { name: '파일명(확장자명, 용량)' },
      ],
      links: [
        { label: '브랜드 홈페이지', url: 'https://', description: '입력 완료 정보' },
        { label: '브랜드 인스타그램 계정', url: 'https://' },
      ],
      feedback: {
        date: '2025.05.12',
        content:
          '안녕하세요.\n마케팅팀 담당 OOO입니다.\n보내주신 1차 숏폼 콘텐츠 결과물 3종 모두 꼼꼼히 확인했습니다. 크루 활동이 특히 돋보이는 기획력에 감사드립니다.\n\n다만, 숏폼이다보니 클릭율을 한 단계 더 끌고가기 위해, 몇 가지 텍스트 리뷰 및 수정 사항과 숏폼 길이 조정에 대한 피드백을 전달드립니다.\n상세 수정 요청 사항은 아래 첨부된 피드백 파일을 참고해 주시기 바라며, 다시 우수 퍼포먼스 영상 활용도 함께 공유해 드리니 참조 작업물(2차) 제작 시 반영해 주시면 감사하겠습니다!\n\n그럼 1차수정사항 다음 최종 결과물도 기대하겠습니다!\n\n감사합니다.',
        files: [{ name: '파일명(확장자명, 용량)', description: '입력 완료 정보' }],
        links: [{ label: '브랜드 홈페이지', url: 'https://', description: '입력 완료 정보' }],
      },
    },
    {
      id: '3',
      indicatorType: 'gray',
      indicatorLabel: '답변 완료',
      title: '제목',
      author: '이름',
      registeredDate: '2000.00.00',
    },
    {
      id: '4',
      indicatorType: 'gray',
      indicatorLabel: '답변 완료',
      title: '제목',
      author: '이름',
      registeredDate: '2000.00.00',
    },
    {
      id: '5',
      indicatorType: 'gray',
      indicatorLabel: '답변 완료',
      title: '제목',
      author: '이름',
      registeredDate: '2000.00.00',
    },
  ],
  crewApplications: [],
};

export const COMPANY_PROJECT_COMPLETED_MOCK: CompanyProjectDetail = {
  projectTitle: '프로젝트 제목이 들어갈 자리입니다.',
  brandName: 'CONX',
  managerName: '김담당자',
  email: 'abcdefg@gmail.com',
  projectId: 'p5',
  fundingAmount: '500,000',
  progressSteps: [
    { label: '매칭 완료', date: '2025.05.10', type: 'completed' },
    { label: '진행 중', date: '2000.00.00', type: 'completed' },
    { label: '진행 완료', date: '2000.00.00', type: 'completed' },
    { label: '제출 완료', date: '2000.00.00', type: 'completed' },
    { label: '정산 완료', date: '2000.00.00', type: 'completed' },
  ],
  submissionCriteria: [
    { label: '숏폼 원본 파일', checked: true },
    { label: '숏폼 업로드 링크', checked: true },
    { label: '조회수/댓글 수 등 정량 지표 포함', checked: true },
    { label: '실행 회고 및 인사이트 작성', checked: true },
  ],
  matchedCrew: {
    crewId: '1',
    profileSrc: '/placeholder.png',
    name: 'CEOS',
    subtitle: 'IT 창업 동아리',
  },
  settlementStatus: 'completed',
  settlementAmount: '500,000',
  results: [
    {
      id: '1',
      indicatorType: 'gray',
      indicatorLabel: '답변 완료',
      title: '제목',
      author: '이름',
      registeredDate: '2000.00.00',
    },
    {
      id: '2',
      indicatorType: 'gray',
      indicatorLabel: '답변 완료',
      title: '제목',
      author: '이름',
      registeredDate: '2000.00.00',
    },
    {
      id: '3',
      indicatorType: 'gray',
      indicatorLabel: '답변 완료',
      title: '제목',
      author: '이름',
      registeredDate: '2000.00.00',
    },
    {
      id: '4',
      indicatorType: 'gray',
      indicatorLabel: '답변 완료',
      title: '제목',
      author: '이름',
      registeredDate: '2000.00.00',
    },
    {
      id: '5',
      indicatorType: 'gray',
      indicatorLabel: '답변 완료',
      title: '제목',
      author: '이름',
      registeredDate: '2000.00.00',
    },
  ],
  crewApplications: [],
};

// === 작업 목록 ===

export const COMPANY_TASKS: WorkspaceTask[] = [
  {
    id: '1',
    taskType: 'selection',
    taskName: '지원 크루 최종 매칭',
    indicatorType: 'blue',
    indicatorLabel: '확인 필요',
    projectName: '프로젝트명',
    brandName: '브랜드명',
    registeredDate: '2000.00.00',
    projectId: 'p1',
  },
  {
    id: '2',
    taskType: 'projectStart',
    taskName: '프로젝트 시작 예정',
    indicatorType: 'blue',
    indicatorLabel: '확인 필요',
    projectName: '프로젝트명',
    brandName: '브랜드명',
    registeredDate: '2000.00.00',
    projectId: 'p2',
  },
  {
    id: '3',
    taskType: 'projectEnd',
    taskName: '프로젝트 종료 예정',
    indicatorType: 'blue',
    indicatorLabel: '확인 필요',
    projectName: '프로젝트명',
    brandName: '브랜드명',
    registeredDate: '2000.00.00',
    projectId: 'p3',
  },
  {
    id: '4',
    taskType: 'feedback',
    taskName: '결과물 검수',
    indicatorType: 'blue',
    indicatorLabel: '확인 필요',
    projectName: '프로젝트명',
    brandName: '브랜드명',
    registeredDate: '2000.00.00',
    projectId: 'p4',
  },
  {
    id: '5',
    taskType: 'feedback',
    taskName: '결과물 검수',
    indicatorType: 'green',
    indicatorLabel: '진행 중',
    projectName: '프로젝트명',
    brandName: '브랜드명',
    registeredDate: '2000.00.00',
    projectId: 'p5',
  },
  {
    id: '6',
    taskType: 'feedback',
    taskName: '결과물 검수',
    indicatorType: 'green',
    indicatorLabel: '진행 중',
    projectName: '프로젝트명',
    brandName: '브랜드명',
    registeredDate: '2000.00.00',
    projectId: 'p6',
  },
  {
    id: '7',
    taskType: 'feedback',
    taskName: '결과물 검수',
    indicatorType: 'green',
    indicatorLabel: '진행 중',
    projectName: '프로젝트명',
    brandName: '브랜드명',
    registeredDate: '2000.00.00',
    projectId: 'p7',
  },
  {
    id: '8',
    taskType: 'feedback',
    taskName: '결과물 검수',
    indicatorType: 'gray',
    indicatorLabel: '완료',
    projectName: '프로젝트명',
    brandName: '브랜드명',
    registeredDate: '2000.00.00',
    projectId: 'p8',
  },
  {
    id: '9',
    taskType: 'feedback',
    taskName: '결과물 검수',
    indicatorType: 'gray',
    indicatorLabel: '완료',
    projectName: '프로젝트명',
    brandName: '브랜드명',
    registeredDate: '2000.00.00',
    projectId: 'p9',
  },
  {
    id: '10',
    taskType: 'settlement',
    taskName: '지원금 정산',
    indicatorType: 'gray',
    indicatorLabel: '완료',
    projectName: '프로젝트명',
    brandName: '브랜드명',
    registeredDate: '2000.00.00',
    projectId: 'p10',
  },
];
