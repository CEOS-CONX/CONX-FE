// GET /api/v1/projects/{projectId} 응답 payload (모집 중인 프로젝트 상세)

export interface ProjectResultForm {
  platform: string;
  contentType: string;
  numberOfResult: number;
  finalResult: string;
}

export interface ProjectFile {
  fileId: number;
  fileName: string;
  extension: string;
  size: number;
  url: string;
  explanation: string;
}

export interface ProjectQuestion {
  questionId: number;
  projectId: number;
  questionName: string; // 제목 (백엔드: 상세 목록은 questionName, 작성 API는 subject)
  writerId: number;
  writerRole: 'CREW' | 'COMPANY' | 'ADMIN' | 'TEMPORAL';
  writerName: string;
  content: string;
  secret: boolean;
  canView: boolean;
  answered: boolean;
  answeredAt: string | null;
  createdAt: string;
}

export interface ProjectDetail {
  isImminent: boolean;
  dayBeforeDeadline: number;
  isBookmarked: boolean; // 로그인 사용자의 북마크 여부
  isApplied: boolean; // 로그인 사용자의 지원 여부
  projectId: number;
  projectImage: string[];
  projectName: string;
  projectExplanation: string;
  brandName: string;
  companyId: number;
  companyName: string;
  companyProfileImage: string | null;
  companyIndustry: string;
  status: string;
  projectType: string;
  recruitDeadLine: string;
  projectStartDate: string;
  projectDeadline: string;
  submitDeadline: string;
  crewType: string;
  peopleNumber: number;
  competency: string;
  preferenceCondition: string;
  resultForm: ProjectResultForm[];
  subsidy: number;
  incentive: boolean;
  incentiveCondition: string;
  files: ProjectFile[];
  // 상세 조회 응답의 링크는 payload.links (등록 요청의 additionalLinks와 필드명 다름).
  // 아이템: linkName(표시 문구) / link(href) / explanation(설명)
  links: { linkName?: string; link?: string; explanation?: string }[];
  views: number;
  question: ProjectQuestion[];
}
