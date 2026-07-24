'use client';

import { Modal } from '@/components/common/Modal';
import type { UserType } from '@/types/auth';

export interface SignupCompleteModalProps {
  userType: UserType;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  onClose: () => void;
}

const MODAL_CONTENT: Record<
  UserType,
  { description: string; primaryLabel: string; secondaryLabel: string }
> = {
  CREW: {
    description: '지금 바로 포트폴리오를 등록하고\n프로젝트에 지원해보세요',
    primaryLabel: '포트폴리오 등록하기',
    secondaryLabel: '크루 정보 추가 등록하기',
  },
  COMPANY: {
    description: '지금 바로 프로젝트를 등록하고\n검증된 크루원과 활동을 시작해보세요',
    primaryLabel: '첫 프로젝트 등록하기',
    secondaryLabel: '기업 정보 추가 등록하기',
  },
};

export default function SignupCompleteModal({
  userType,
  onPrimaryAction,
  onSecondaryAction,
  onClose,
}: SignupCompleteModalProps) {
  const content = MODAL_CONTENT[userType];

  return (
    <Modal
      title="가입이 완료되었습니다!"
      subtitle={<span className="whitespace-pre-line">{content.description}</span>}
      primaryLabel={content.primaryLabel}
      onPrimaryClick={onPrimaryAction}
      secondaryLabel={content.secondaryLabel}
      onSecondaryClick={onSecondaryAction}
      onClose={onClose}
    />
  );
}
