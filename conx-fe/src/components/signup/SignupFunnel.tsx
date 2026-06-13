'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepSelectType, { type UserType } from './StepSelectType';
import StepEmailVerification from './StepEmailVerification';
import StepPasswordAgreement from './StepPasswordAgreement';
import StepCrewProfile, { type CrewProfileData } from './StepCrewProfile';
import StepEnterpriseProfile, { type EnterpriseProfileData } from './StepEnterpriseProfile';
import SignupCompleteModal from './SignupCompleteModal';

type Step = 'select-type' | 'email' | 'password' | 'profile' | 'complete';

interface SignupFunnelProps {
  // 외부에서 type 지정 시 select-type 단계 건너뛰고 바로 email부터 시작
  initialType?: UserType;
}

export default function SignupFunnel({ initialType }: SignupFunnelProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(initialType ? 'email' : 'select-type');
  const [userType, setUserType] = useState<UserType | undefined>(initialType);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [marketingAgreed, setMarketingAgreed] = useState(false);

  function handleSelectType(type: UserType) {
    setUserType(type);
    setStep('email');
  }

  function handleEmailVerified(verifiedEmail: string) {
    setEmail(verifiedEmail);
    setStep('password');
  }

  function handlePasswordDone(pw: string, marketing: boolean) {
    setPassword(pw);
    setMarketingAgreed(marketing);
    setStep('profile');
  }

  function handleProfileDone(data: CrewProfileData | EnterpriseProfileData) {
    // 목업: 실제로는 API 호출
    console.log('회원가입 완료', { userType, email, password, marketingAgreed, ...data });
    setStep('complete');
  }

  function handleClose() {
    router.push('/');
  }

  return (
    <>
      {step === 'select-type' && <StepSelectType onSelect={handleSelectType} />}
      {step === 'email' && <StepEmailVerification onNext={handleEmailVerified} />}
      {step === 'password' && <StepPasswordAgreement email={email} onNext={handlePasswordDone} />}
      {step === 'profile' && userType === 'crew' && <StepCrewProfile onNext={handleProfileDone} />}
      {step === 'profile' && userType === 'enterprise' && (
        <StepEnterpriseProfile onNext={handleProfileDone} />
      )}
      {step === 'complete' && userType && (
        <SignupCompleteModal
          userType={userType}
          onPrimaryAction={() => router.push('/')}
          onSecondaryAction={() => router.push('/')}
          onClose={handleClose}
        />
      )}
    </>
  );
}
