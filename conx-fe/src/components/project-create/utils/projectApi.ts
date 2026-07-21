import { API_ROUTES } from '@/constants/api';
import type { ProjectCreateFormData } from '@/types/project';

function formatDate(date: Date | undefined): string {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// --- 파일 업로드 (Presigned URL 방식) ---

interface PresignedUrlResponse {
  status: string;
  message: string;
  payload: {
    uploadUrl: string;
    fileUrl: string;
    fileKey: string;
  };
}

interface UploadedFile {
  fileUrl: string;
  fileKey: string;
}

export async function uploadFile(file: File): Promise<UploadedFile> {
  // 1. Presigned URL 발급
  const presignedRes = await fetch(API_ROUTES.FILE.UPLOAD, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
    }),
  });

  const presignedData: PresignedUrlResponse = await presignedRes.json();

  if (!presignedRes.ok) {
    throw new Error(presignedData.message ?? 'Presigned URL 발급에 실패했습니다.');
  }

  const { uploadUrl, fileUrl, fileKey } = presignedData.payload;

  // 2. S3에 파일 업로드
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error('파일 업로드에 실패했습니다.');
  }

  return { fileUrl, fileKey };
}

// --- 프로젝트 payload 변환 ---

export function buildProjectPayload(form: ProjectCreateFormData) {
  return {
    brandName: form.brandName,
    managerName: form.managerName,
    managerEmail: form.email,
    projectImages: form.projectImages.filter((img) => img.fileUrl).map((img) => img.fileUrl),
    projectName: form.projectName,
    projectExplanation: form.introduction,
    industry: form.industry || undefined,
    projectType: form.projectType || undefined,
    resultForm: form.outcomes
      .filter((o) => o.platform || o.contentType || o.finalSubmission)
      .map((o) => ({
        platform: o.platform,
        contentType: o.contentType,
        numberOfResult: o.count,
        finalResult: o.finalSubmission,
      })),
    recruitDeadline: formatDate(form.recruitDeadline),
    projectStartDate: formatDate(form.projectStartDate),
    projectDeadline: formatDate(form.projectEndDate),
    submitDeadline: formatDate(form.submissionDate),
    subsidy: form.subsidy,
    incentive: form.hasIncentive ?? false,
    incentiveCondition: form.incentiveCondition || undefined,
    crewType: form.crewType || undefined,
    peopleNumber: form.memberCount,
    competency: form.requiredSkills,
    preferenceCondition: form.preferredConditions || undefined,
    fileLinks: form.referenceFiles
      .filter((f) => f.fileUrl)
      .map((f) => ({
        originalName: f.name,
        fileLinks: f.fileUrl,
        explanation: f.description || undefined,
      })),
    additionalLinks: form.links
      .filter((l) => l.url)
      .map((l) => ({
        linkName: l.name,
        link: l.url.startsWith('http') ? l.url : `https://${l.url}`,
        explanation: l.description || undefined,
      })),
  };
}

// --- 프로젝트 등록 ---

export async function createProject(form: ProjectCreateFormData, isDraft = false) {
  const payload = buildProjectPayload(form);

  const res = await fetch(`/api/companies/me/projects?isDraft=${isDraft}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message ?? '프로젝트 등록에 실패했습니다.');
  }

  return data;
}

// --- 임시저장 ---

export async function saveDraft(form: ProjectCreateFormData, isUpdate = false) {
  const payload = buildProjectPayload(form);

  const res = await fetch('/api/companies/me/project-drafts', {
    method: isUpdate ? 'PATCH' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message ?? '임시저장에 실패했습니다.');
  }

  return data;
}

// --- 임시저장 존재 여부 확인 ---

export async function checkHasDraft(): Promise<boolean> {
  const res = await fetch('/api/companies/me/projects/hasDraft');
  const data = await res.json();
  if (!res.ok) return false;
  return data.payload ?? false;
}

// --- 임시저장 불러오기 ---

export async function loadDraft(): Promise<ProjectCreateFormData> {
  const res = await fetch('/api/companies/me/project-drafts');
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message ?? '임시저장 불러오기에 실패했습니다.');
  }

  const p = data.payload;

  return {
    useMyInfo: false,
    brandName: p.brandName ?? '',
    managerName: p.managerName ?? '',
    email: p.managerEmail ?? '',
    projectImages: (p.projectImage ?? p.projectImages ?? []).map((url: string, i: number) => ({
      id: `draft-img-${i}`,
      file: null,
      preview: url,
      fileId: null,
      fileUrl: url,
    })),
    projectName: p.projectName ?? '',
    introduction: p.projectExplanation ?? '',
    industry: p.industry ?? '',
    projectType: p.projectType ?? '',
    outcomes: (p.resultForm ?? []).map(
      (
        r: { platform: string; contentType: string; numberOfResult: number; finalResult: string },
        i: number,
      ) => ({
        id: `draft-outcome-${i}`,
        platform: r.platform ?? '',
        contentType: r.contentType ?? '',
        count: r.numberOfResult ?? 0,
        finalSubmission: r.finalResult ?? '',
        description: '',
      }),
    ),
    recruitDeadline:
      (p.recruitDeadLine ?? p.recruitDeadline)
        ? new Date(p.recruitDeadLine ?? p.recruitDeadline)
        : undefined,
    projectStartDate: p.projectStartDate ? new Date(p.projectStartDate) : undefined,
    projectEndDate: p.projectDeadline ? new Date(p.projectDeadline) : undefined,
    submissionDate: p.submitDeadline ? new Date(p.submitDeadline) : undefined,
    subsidy: p.subsidy ?? 0,
    hasIncentive: p.incentive ?? null,
    incentiveCondition: p.incentiveCondition ?? '',
    crewType: p.crewType ?? '',
    memberCount: p.peopleNumber ?? 0,
    requiredSkills: p.competency ?? '',
    preferredConditions: p.preferenceCondition ?? '',
    referenceFiles: (p.files ?? p.fileLinks ?? []).map(
      (
        f: {
          originalName?: string;
          fileName?: string;
          fileLinks?: string;
          url?: string;
          explanation?: string;
        },
        i: number,
      ) => ({
        id: `draft-file-${i}`,
        file: null,
        name: f.originalName ?? f.fileName ?? '',
        size: 0,
        description: f.explanation ?? '',
        fileId: null,
        fileUrl: f.fileLinks ?? f.url ?? '',
      }),
    ),
    links: (p.links ?? p.additionalLinks ?? []).map(
      (
        l: { linkName?: string; name?: string; link?: string; url?: string; explanation?: string },
        i: number,
      ) => ({
        id: `draft-link-${i}`,
        name: l.linkName ?? l.name ?? '',
        url: l.link ?? l.url ?? '',
        description: l.explanation ?? '',
      }),
    ),
  };
}
