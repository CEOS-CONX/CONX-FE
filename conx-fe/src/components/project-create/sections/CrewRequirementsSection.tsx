import { TextFieldInput } from '@/components/common/TextFieldInput';
import { DropdownForm } from '@/components/common/DropdownForm';
import TextFieldNumeric from '@/components/project-create/TextFieldNumeric';
import { CREW_TYPE_OPTIONS } from '@/constants/browse';
import type { ProjectCreateFormData } from '@/types/project';

interface CrewRequirementsSectionProps {
  form: Pick<
    ProjectCreateFormData,
    'crewType' | 'memberCount' | 'requiredSkills' | 'preferredConditions'
  >;
  onUpdate: <K extends keyof ProjectCreateFormData>(
    key: K,
    value: ProjectCreateFormData[K],
  ) => void;
  onFieldFocus?: (field: string) => void;
}

export default function CrewRequirementsSection({
  form,
  onUpdate,
  onFieldFocus,
}: CrewRequirementsSectionProps) {
  return (
    <section className="flex w-full flex-col gap-7">
      <h2 className="text-kor-heading-1-bold text-conx-common-black">모집 크루 조건</h2>

      <div className="flex flex-col gap-9">
        <div className="flex gap-6">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onFieldFocus?.('크루 유형');
            }}
            onFocus={() => onFieldFocus?.('크루 유형')}
          >
            <DropdownForm
              size="lg"
              label="크루 유형"
              placeholder="내용을 선택해주세요"
              options={CREW_TYPE_OPTIONS}
              value={form.crewType}
              onChange={(v) => onUpdate('crewType', v)}
            />
          </div>
          <TextFieldNumeric
            suffix="명"
            label="참여 인원수"
            required
            emptyError="1명 이상의 인원수를 입력해주세요"
            value={form.memberCount}
            onChange={(v) => onUpdate('memberCount', v)}
          />
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            onFieldFocus?.('필수 역량');
          }}
          onFocus={() => onFieldFocus?.('필수 역량')}
        >
          <TextFieldInput
            size="full"
            label="필수 역량"
            required
            placeholder="내용을 입력해주세요"
            value={form.requiredSkills}
            onChange={(e) => onUpdate('requiredSkills', e.target.value)}
          />
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            onFieldFocus?.('우대 조건');
          }}
          onFocus={() => onFieldFocus?.('우대 조건')}
        >
          <TextFieldInput
            size="full"
            label="우대 조건"
            placeholder="내용을 입력해주세요"
            value={form.preferredConditions}
            onChange={(e) => onUpdate('preferredConditions', e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
