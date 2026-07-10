'use client';

import LogoConxTitle from '@/assets/icons/logo_conx_title.svg';
import { ChoiceCard } from '@/components/common/ChoiceCard';
import { USER_TYPE, type UserType } from '@/types/auth';

interface StepSelectTypeProps {
  onSelect: (type: UserType) => void;
}

export default function StepSelectType({ onSelect }: StepSelectTypeProps) {
  return (
    <div className="flex flex-col gap-17">
      <div className="flex flex-col gap-9">
        <LogoConxTitle className="h-6.25 w-28" />
        <h1 className="text-kor-display-3-bold text-conx-common-black">
          서비스 이용 유형을
          <br />
          선택해주세요
        </h1>
      </div>

      <div className="flex gap-6">
        <ChoiceCard
          title="기업"
          description="프로젝트를 등록하고 검증된 집단과 연결하세요"
          onClick={() => onSelect(USER_TYPE.COMPANY)}
        />
        <ChoiceCard
          title="크루"
          description="프로젝트에 참여하고 활동의 가치를 증명하세요"
          onClick={() => onSelect(USER_TYPE.CREW)}
        />
      </div>
    </div>
  );
}
