// GET /api/v1/crews/{crewId} 응답 payload (크루 상세)

export interface CrewLink {
  linkId: number;
  name: string;
  url: string;
  description: string;
}

export interface CrewFile {
  fileId: number;
  fileName: string;
  extension: string;
  size: number;
  url: string;
  description: string;
}

export interface CrewPortfolio {
  id: number;
  imageLink: string; // 썸네일 이미지
  name: string;
  fileLink: string; // 미리보기 대상 파일
}

export interface CrewResultForm {
  platform: string;
  contentType: string;
  numberOfResult: number;
  finalResult: string;
}

export interface CrewProjectHistory {
  projectId: number;
  status: string;
  projectName: string;
  brandName: string;
  projectType: string;
  resultForm: CrewResultForm[];
  point: number;
  projectStartDate: string;
  projectDeadline: string;
}

export interface CrewDetail {
  crewId: number;
  profileImage: string | null;
  crewName: string;
  crewType: string;
  customCrewType: string | null;
  activityField: string;
  schools: string[];
  memberAmount: number;
  category: string;
  catchphrase: string;
  crewIntroduction: string;
  advantages: string[];
  specialties: string[];
  links: CrewLink[];
  files: CrewFile[];
  portfolios: CrewPortfolio[];
  representativeProjects: CrewProjectHistory[];
  hasPublicDetail: boolean;
  bookmarked: boolean;
  point: number;
  totalProject: number;
}
