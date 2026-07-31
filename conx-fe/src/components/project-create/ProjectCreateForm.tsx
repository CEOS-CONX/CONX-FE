'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProjectCreateNavbar from '@/components/project-create/ProjectCreateNavbar';
import WritingTipButton from '@/components/project-create/WritingTipButton';
import Toast from '@/components/common/Toast/Toast';
import Modal from '@/components/common/Modal/Modal';
import ProjectSubmitModal from '@/components/project-create/ProjectSubmitModal';
import BrandInfoSection from '@/components/project-create/sections/BrandInfoSection';
import ProjectDescriptionSection from '@/components/project-create/sections/ProjectDescriptionSection';
import CrewRequirementsSection from '@/components/project-create/sections/CrewRequirementsSection';
import ReferencesSection from '@/components/project-create/sections/ReferencesSection';
import { INITIAL_PROJECT_FORM, type ProjectCreateFormData } from '@/types/project';
import {
  createProject,
  saveDraft,
  loadDraft,
  checkHasDraft,
} from '@/components/project-create/utils/projectApi';

export default function ProjectCreateForm() {
  const router = useRouter();
  const [form, setForm] = useState<ProjectCreateFormData>(INITIAL_PROJECT_FORM);
  const [showDraftToast, setShowDraftToast] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const [activeField, setActiveField] = useState<string | undefined>();
  const [hasDraft, setHasDraft] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [scheduleError, setScheduleError] = useState('');
  const [scheduleErrorFields, setScheduleErrorFields] = useState<Set<string>>(new Set());

  const myInfoRef = useRef<{ brandName: string; name: string; email: string } | null>(null);

  useEffect(() => {
    async function prefetchMyInfo() {
      try {
        const [profileRes, accountRes] = await Promise.all([
          fetch('/api/companies/me/profile'),
          fetch('/api/companies/me/account'),
        ]);
        const [profileData, accountData] = await Promise.all([
          profileRes.json(),
          accountRes.json(),
        ]);
        if (profileRes.ok && accountRes.ok) {
          myInfoRef.current = {
            brandName: profileData.payload?.brandName ?? '',
            name: accountData.payload?.name ?? '',
            email: accountData.payload?.email ?? '',
          };
        }
      } catch {
        /* noop — 체크 시 빈 값으로 처리 */
      }
    }
    prefetchMyInfo();
  }, []);

  // 진입 시 임시저장 존재 여부 확인
  useEffect(() => {
    async function check() {
      const exists = await checkHasDraft();
      setHasDraft(exists);
    }
    check();
  }, []);

  const updateField = useCallback(
    <K extends keyof ProjectCreateFormData>(key: K, value: ProjectCreateFormData[K]) => {
      setForm((prev) => {
        const next = { ...prev, [key]: value };

        if (key === 'projectEndDate' && next.projectStartDate && next.projectEndDate) {
          if (next.projectEndDate.getTime() < next.projectStartDate.getTime()) {
            next.projectEndDate = undefined;
            setScheduleError('프로젝트 마감일은 프로젝트 시작일 이후여야 합니다.');
            setScheduleErrorFields(new Set(['projectEndDate']));
            return next;
          }
        }
        if (key === 'projectStartDate' && next.recruitDeadline && next.projectStartDate) {
          if (next.projectStartDate.getTime() < next.recruitDeadline.getTime()) {
            next.projectStartDate = undefined;
            setScheduleError('프로젝트 시작일은 크루 모집 마감일 이후여야 합니다.');
            setScheduleErrorFields(new Set(['projectStartDate']));
            return next;
          }
        }
        if (key === 'submissionDate' && next.submissionDate) {
          if (
            next.projectStartDate &&
            next.submissionDate.getTime() < next.projectStartDate.getTime()
          ) {
            next.submissionDate = undefined;
            setScheduleError('결과물 제출일은 프로젝트 시작일 이후여야 합니다.');
            setScheduleErrorFields(new Set(['submissionDate']));
            return next;
          }
          if (
            next.recruitDeadline &&
            next.submissionDate.getTime() < next.recruitDeadline.getTime()
          ) {
            next.submissionDate = undefined;
            setScheduleError('결과물 제출일은 크루 모집 마감일 이후여야 합니다.');
            setScheduleErrorFields(new Set(['submissionDate']));
            return next;
          }
        }

        if ((key === 'brandName' || key === 'managerName' || key === 'email') && next.useMyInfo) {
          next.useMyInfo = false;
        }

        if (
          key === 'projectStartDate' ||
          key === 'projectEndDate' ||
          key === 'recruitDeadline' ||
          key === 'submissionDate'
        ) {
          setScheduleErrorFields((prev) => {
            if (prev.size > 0) {
              setScheduleError('');
              return new Set();
            }
            return prev;
          });
        }

        return next;
      });
    },
    [],
  );

  const handleUseMyInfo = useCallback(
    (checked: boolean) => {
      updateField('useMyInfo', checked);
      if (checked && myInfoRef.current) {
        setForm((prev) => ({
          ...prev,
          brandName: myInfoRef.current!.brandName,
          managerName: myInfoRef.current!.name,
          email: myInfoRef.current!.email,
        }));
      }
    },
    [updateField],
  );

  async function handleSaveDraft() {
    try {
      await saveDraft(form, hasDraft);
      setHasDraft(true);
      setShowDraftToast(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : '임시저장에 실패했습니다.');
    }
  }

  async function handleLoadDraft() {
    try {
      const draftForm = await loadDraft();
      setForm(draftForm);
      setDraftLoaded(true);
    } catch {
      alert('임시저장 불러오기에 실패했습니다.');
    }
  }

  function handleSubmit() {
    setShowSubmitModal(true);
  }

  async function handleConfirmSubmit() {
    setShowSubmitModal(false);
    try {
      await createProject(form);
      router.push('/projects');
    } catch (e) {
      // TODO: 에러 처리 (토스트 등)
    }
  }

  function formatSubmissionDate(): string {
    if (!form.submissionDate) return '-';
    const y = form.submissionDate.getFullYear();
    const m = String(form.submissionDate.getMonth() + 1).padStart(2, '0');
    const d = String(form.submissionDate.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  }

  return (
    <div className="relative">
      <ProjectCreateNavbar
        hasDraft={hasDraft && !draftLoaded}
        onBack={() => setShowBackModal(true)}
        onSaveDraft={handleSaveDraft}
        onLoadDraft={handleLoadDraft}
        onSubmit={handleSubmit}
      />

      <main
        className="mx-auto max-w-295 px-4 pt-17.5 pb-32.5"
        onClick={() => setActiveField(undefined)}
      >
        <div className="bg-conx-common-white mx-auto flex w-295 flex-col gap-27.5 rounded-md px-30.25 pt-17 pb-15">
          <BrandInfoSection
            form={form}
            onUpdate={updateField}
            onUseMyInfo={handleUseMyInfo}
            onFieldFocus={setActiveField}
          />
          <ProjectDescriptionSection
            form={form}
            onUpdate={updateField}
            scheduleError={scheduleError}
            scheduleErrorFields={scheduleErrorFields}
            onFieldFocus={setActiveField}
          />
          <CrewRequirementsSection
            form={form}
            onUpdate={updateField}
            onFieldFocus={setActiveField}
          />
          <ReferencesSection form={form} onUpdate={updateField} onFieldFocus={setActiveField} />
        </div>
      </main>

      <WritingTipButton activeField={activeField} />

      {showDraftToast && (
        <Toast
          message="임시저장이 완료되었습니다"
          duration={5000}
          onClose={() => setShowDraftToast(false)}
        />
      )}

      {showSubmitModal && (
        <ProjectSubmitModal
          projectTitle={form.projectName}
          submissionDate={formatSubmissionDate()}
          outcomeCount={form.outcomes.reduce((sum, o) => sum + o.count, 0)}
          subsidy={form.subsidy}
          onSubmit={handleConfirmSubmit}
          onClose={() => setShowSubmitModal(false)}
        />
      )}

      {showBackModal && (
        <Modal
          title="작성 중인 내용을 저장할까요?"
          subtitle="저장하지 않고 나가면 현재까지 작성한 내용은 복구할 수 없습니다."
          primaryLabel="저장하기"
          onPrimaryClick={() => {
            handleSaveDraft();
            setShowBackModal(false);
            router.back();
          }}
          secondaryLabel="페이지에서 나가기"
          onSecondaryClick={() => {
            setShowBackModal(false);
            router.back();
          }}
          onClose={() => setShowBackModal(false)}
        />
      )}
    </div>
  );
}
