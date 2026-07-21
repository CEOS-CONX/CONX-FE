import { TextFieldInput } from '@/components/common/TextFieldInput';
import { RadioButton } from '@/components/common/RadioButton';
import type { ProjectCreateFormData } from '@/types/project';

interface BrandInfoSectionProps {
  form: Pick<ProjectCreateFormData, 'useMyInfo' | 'brandName' | 'managerName' | 'email'>;
  onUpdate: <K extends keyof ProjectCreateFormData>(
    key: K,
    value: ProjectCreateFormData[K],
  ) => void;
  onFieldFocus?: (field: string) => void;
}

export default function BrandInfoSection({ form, onUpdate, onFieldFocus }: BrandInfoSectionProps) {
  return (
    <section className="flex w-full flex-col gap-7">
      <h2 className="text-kor-heading-1-bold text-conx-common-black">브랜드 정보</h2>

      <div className="flex flex-col gap-5.5">
        <RadioButton
          checked={form.useMyInfo}
          onChange={(checked) => onUpdate('useMyInfo', checked)}
        >
          내 정보 그대로 넣기
        </RadioButton>

        <div className="flex flex-col gap-9">
          <div className="flex gap-6">
            <div
              onClick={(e) => {
                e.stopPropagation();
                onFieldFocus?.('브랜드명');
              }}
              onFocus={() => onFieldFocus?.('브랜드명')}
            >
              <TextFieldInput
                size="lg"
                label="브랜드명"
                required
                placeholder="내용을 입력해주세요"
                value={form.brandName}
                onChange={(e) => onUpdate('brandName', e.target.value)}
              />
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onFieldFocus?.('담당자 이름');
              }}
              onFocus={() => onFieldFocus?.('담당자 이름')}
            >
              <TextFieldInput
                size="lg"
                label="담당자 이름"
                required
                placeholder="내용을 입력해주세요"
                value={form.managerName}
                onChange={(e) => onUpdate('managerName', e.target.value)}
              />
            </div>
          </div>

          <TextFieldInput
            size="lg"
            label="이메일"
            required
            placeholder="내용을 입력해주세요"
            value={form.email}
            onChange={(e) => onUpdate('email', e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
