import { API_ROUTES } from '@/constants/api';
import type { ProjectCreateFormData } from '@/types/project';

function formatDate(date: Date | undefined): string {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// --- 파일 업로드 ---

interface UploadedFile {
  fileId: number;
  fileUrl: string;
}

export async function uploadFile(file: File): Promise<UploadedFile> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(API_ROUTES.FILE.UPLOAD, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message ?? '파일 업로드에 실패했습니다.');
  }

  return data;
}

// --- 프로젝트 등록 ---

export function buildProjectPayload(form: ProjectCreateFormData) {
  return {
    // 대표 이미지: 첨부 시점에 업로드된 첫 번째 이미지의 URL 사용
    projectImage: form.projectImages.find((img) => img.fileUrl)?.fileUrl || null,
    brandName: form.brandName,
    managerName: form.managerName,
    managerEmail: form.email,
    // TODO: 프로젝트 등록 폼에 담당자 전화번호 입력 필드가 없음.
    // 피그마 디자인에 해당 필드가 존재하지 않아 임시로 하드코딩.
    // 추후 디자인 확정 시 폼 필드 추가 또는 API 스펙 변경에 맞춰 수정 필요.
    managerPhone: '000-0000-0000',
    projectName: form.projectName,
    projectObjective: form.introduction,
    projectType: form.projectType,
    requirement:
      form.outcomes
        .map((o) => o.description)
        .filter(Boolean)
        .join(', ') || null,
    submitForm: form.outcomes
      .map((o) => o.finalSubmission)
      .filter(Boolean)
      .join(', '),
    essentialSubmitItem: form.outcomes
      .map((o) => o.platform)
      .filter(Boolean)
      .join(', '),
    recruitEndDate: formatDate(form.recruitDeadline),
    projectStartDate: formatDate(form.projectStartDate),
    projectEndDate: formatDate(form.projectEndDate),
    resultSubmitDate: formatDate(form.submissionDate),
    crewType: form.crewType || null,
    essentialAbility: form.requiredSkills,
    preferCondition: form.preferredConditions || null,
    subsidy: form.subsidy,
    incentive: form.hasIncentive ?? false,
    incentiveCondition: form.incentiveCondition || null,
    // 파일은 첨부 시점에 이미 업로드되어 fileId/fileUrl이 저장됨
    files: form.referenceFiles
      .filter((f) => f.fileId !== null)
      .map((f) => ({ id: f.fileId, url: f.fileUrl })),
    referenceLink:
      form.links
        .filter((l) => l.url)
        .map((l) => `https://${l.url}`)
        .join(', ') || null,
  };
}

export async function createProject(form: ProjectCreateFormData) {
  const payload = buildProjectPayload(form);

  const res = await fetch(API_ROUTES.PROJECT.CREATE, {
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
