'use client';

import { useState } from 'react';
import LogoConxTitle from '@/assets/icons/logo_conx_title.svg';
import { CTAButton } from '@/components/common/CTAButton';
import { DropdownForm } from '@/components/common/DropdownForm';
import { TextFieldInput } from '@/components/common/TextFieldInput';
import { CREW_TYPE_OPTIONS, INDUSTRY_OPTIONS } from '@/constants/browse';

export interface CrewProfileData {
  crewName: string;
  crewType: string;
  field: string;
  managerName: string;
  position: string;
}

interface StepCrewProfileProps {
  onNext: (data: CrewProfileData) => void;
}

export default function StepCrewProfile({ onNext }: StepCrewProfileProps) {
  const [crewName, setCrewName] = useState('');
  const [crewType, setCrewType] = useState<string>();
  const [field, setField] = useState<string>();
  const [managerName, setManagerName] = useState('');
  const [position, setPosition] = useState('');

  const canSubmit = crewName.trim() && crewType && field && managerName.trim() && position.trim();

  function handleSubmit() {
    if (!canSubmit || !crewType || !field) return;
    onNext({ crewName, crewType, field, managerName, position });
  }

  return (
    <div className="flex flex-col items-center gap-15.5">
      <div className="flex w-full flex-col gap-13">
        <div className="flex flex-col gap-9">
          <LogoConxTitle className="h-6.25 w-28" />
          <h1 className="text-kor-title-1-bold text-conx-common-black">
            프로필에 등록할 기본정보를
            <br />
            입력해주세요
          </h1>
        </div>

        <div className="flex flex-col gap-9">
          <TextFieldInput
            size="lg"
            label="크루명"
            placeholder="내용을 입력하세요"
            value={crewName}
            onChange={(e) => setCrewName(e.target.value)}
          />
          <DropdownForm
            size="lg"
            label="크루 유형"
            placeholder="내용을 입력하세요"
            options={CREW_TYPE_OPTIONS}
            value={crewType}
            onChange={setCrewType}
          />
          <DropdownForm
            size="lg"
            label="활동 분야"
            placeholder="내용을 입력하세요"
            options={INDUSTRY_OPTIONS}
            value={field}
            onChange={setField}
          />
          <TextFieldInput
            size="lg"
            label="담당자명"
            placeholder="내용을 입력하세요"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
          />
          <TextFieldInput
            size="lg"
            label="직무"
            placeholder="내용을 입력하세요"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
      </div>

      <CTAButton disabled={!canSubmit} onClick={handleSubmit} className="w-114.5">
        가입하기
      </CTAButton>
    </div>
  );
}
