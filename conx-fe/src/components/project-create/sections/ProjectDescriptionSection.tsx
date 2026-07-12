import IconError from '@/assets/icons/icon_error.svg';
import { TextFieldInput } from '@/components/common/TextFieldInput';
import { DropdownForm } from '@/components/common/DropdownForm';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';
import { ImageUploader } from '@/components/common/ImageUploader';
import TextFieldOutcome from '@/components/project-create/TextFieldOutcome';
import TextFieldNumeric from '@/components/project-create/TextFieldNumeric';
import IncentiveField from '@/components/project-create/IncentiveField';
import { INDUSTRY_OPTIONS, PROJECT_TYPE_OPTIONS } from '@/constants/browse';
import type { ProjectCreateFormData } from '@/types/project';

interface ProjectDescriptionSectionProps {
  form: Pick<
    ProjectCreateFormData,
    | 'projectImages'
    | 'projectName'
    | 'introduction'
    | 'industry'
    | 'projectType'
    | 'outcomes'
    | 'recruitDeadline'
    | 'projectStartDate'
    | 'projectEndDate'
    | 'submissionDate'
    | 'subsidy'
    | 'hasIncentive'
    | 'incentiveCondition'
  >;
  onUpdate: <K extends keyof ProjectCreateFormData>(
    key: K,
    value: ProjectCreateFormData[K],
  ) => void;
  scheduleError?: string;
  onFieldFocus?: (field: string) => void;
}

export default function ProjectDescriptionSection({
  form,
  onUpdate,
  scheduleError,
  onFieldFocus,
}: ProjectDescriptionSectionProps) {
  return (
    <section className="flex w-full flex-col gap-7">
      <h2 className="text-kor-heading-1-bold text-conx-common-black">프로젝트 설명</h2>

      <div className="flex flex-col gap-9">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onFieldFocus?.('프로젝트 이미지');
          }}
        >
          <ImageUploader
            label="프로젝트 이미지"
            helperText="이미지를 끌고 오거나 칸을 눌러 첨부해주세요(50mb 이하)"
            value={form.projectImages}
            onChange={(images) => onUpdate('projectImages', images)}
          />
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            onFieldFocus?.('프로젝트명');
          }}
          onFocus={() => onFieldFocus?.('프로젝트명')}
        >
          <TextFieldInput
            size="full"
            label="프로젝트명"
            required
            placeholder="내용을 입력해주세요"
            value={form.projectName}
            onChange={(e) => onUpdate('projectName', e.target.value)}
          />
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            onFieldFocus?.('소개');
          }}
          onFocus={() => onFieldFocus?.('소개')}
        >
          <TextFieldInput
            size="full"
            label="소개"
            required
            placeholder="내용을 입력해주세요"
            value={form.introduction}
            onChange={(e) => onUpdate('introduction', e.target.value)}
          />
        </div>

        <div className="flex gap-6">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onFieldFocus?.('산업 분야');
            }}
            onFocus={() => onFieldFocus?.('산업 분야')}
          >
            <DropdownForm
              size="lg"
              label="산업 분야"
              required
              placeholder="내용을 선택해주세요"
              options={INDUSTRY_OPTIONS}
              value={form.industry}
              onChange={(v) => onUpdate('industry', v)}
            />
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onFieldFocus?.('프로젝트 유형');
            }}
            onFocus={() => onFieldFocus?.('프로젝트 유형')}
          >
            <DropdownForm
              size="lg"
              label="프로젝트 유형"
              required
              placeholder="내용을 선택해주세요"
              options={PROJECT_TYPE_OPTIONS}
              value={form.projectType}
              onChange={(v) => onUpdate('projectType', v)}
            />
          </div>
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            onFieldFocus?.('결과물');
          }}
          onFocus={() => onFieldFocus?.('결과물')}
        >
          <TextFieldOutcome
            value={form.outcomes}
            onChange={(items) => onUpdate('outcomes', items)}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex gap-0.5">
            <span className="text-kor-body-1-semibold text-conx-common-black">일정</span>
            <span className="bg-conx-red-500 mt-0.5 inline-block h-1 w-1 rounded-full" />
          </div>
          <div className="flex items-start gap-6">
            <DropdownCalendar
              placeholder="크루 모집 마감일"
              subLabel="모집 마감일"
              value={form.recruitDeadline}
              onChange={(v) => onUpdate('recruitDeadline', v)}
            />
            <DropdownCalendar
              placeholder="프로젝트 시작일"
              subLabel="프로젝트 시작일"
              value={form.projectStartDate}
              onChange={(v) => onUpdate('projectStartDate', v)}
            />
            <DropdownCalendar
              placeholder="프로젝트 마감일"
              subLabel="프로젝트 마감일"
              value={form.projectEndDate}
              onChange={(v) => onUpdate('projectEndDate', v)}
            />
            <DropdownCalendar
              placeholder="결과물 제출일"
              subLabel="결과물 제출일"
              value={form.submissionDate}
              onChange={(v) => onUpdate('submissionDate', v)}
            />
          </div>
          {scheduleError && (
            <p className="text-kor-label-1-medium text-conx-red-500 flex items-center gap-1">
              <IconError className="h-4 w-4 shrink-0" />
              {scheduleError}
            </p>
          )}
        </div>

        <div className="flex gap-6">
          <TextFieldNumeric
            suffix="원"
            label="지원금"
            required
            emptyError="1원 이상의 지원금을 입력해주세요"
            value={form.subsidy}
            onChange={(v) => onUpdate('subsidy', v)}
          />
          <div
            onFocus={() => onFieldFocus?.('인센티브')}
            onClick={(e) => {
              e.stopPropagation();
              onFieldFocus?.('인센티브');
            }}
          >
            <IncentiveField
              value={form.hasIncentive}
              onChange={(v) => onUpdate('hasIncentive', v)}
              condition={form.incentiveCondition}
              onConditionChange={(v) => onUpdate('incentiveCondition', v)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
