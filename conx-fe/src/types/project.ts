export interface ProjectImage {
  id: string;
  file: File | null;
  preview: string;
  fileId: number | null;
  fileUrl: string;
}

export interface OutcomeItem {
  id: string;
  platform: string;
  contentType: string;
  count: number;
  finalSubmission: string;
  description: string;
}

export interface FileUploadItem {
  id: string;
  file: File | null;
  name: string;
  size: number;
  description: string;
  fileId: number | null;
  fileUrl: string;
}

export interface LinkItem {
  id: string;
  name: string;
  url: string;
  description: string;
}

export interface ProjectCreateFormData {
  // 브랜드 정보
  useMyInfo: boolean;
  brandName: string;
  managerName: string;
  email: string;

  // 프로젝트 설명
  projectImages: ProjectImage[];
  projectName: string;
  introduction: string;
  industry: string;
  projectType: string;
  outcomes: OutcomeItem[];
  recruitDeadline: Date | undefined;
  projectStartDate: Date | undefined;
  projectEndDate: Date | undefined;
  submissionDate: Date | undefined;
  subsidy: number;
  hasIncentive: boolean | null;
  incentiveCondition: string;

  // 모집 크루 조건
  crewType: string;
  memberCount: number;
  requiredSkills: string;
  preferredConditions: string;

  // 참고 자료
  referenceFiles: FileUploadItem[];
  links: LinkItem[];
}

export const INITIAL_PROJECT_FORM: ProjectCreateFormData = {
  useMyInfo: false,
  brandName: '',
  managerName: '',
  email: '',
  projectImages: [],
  projectName: '',
  introduction: '',
  industry: '',
  projectType: '',
  outcomes: [],
  recruitDeadline: undefined,
  projectStartDate: undefined,
  projectEndDate: undefined,
  submissionDate: undefined,
  subsidy: 0,
  hasIncentive: null,
  incentiveCondition: '',
  crewType: '',
  memberCount: 0,
  requiredSkills: '',
  preferredConditions: '',
  referenceFiles: [],
  links: [],
};
