'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepSelectType, { type UserType } from './StepSelectType';
import StepEmailVerification from './StepEmailVerification';
import StepPasswordAgreement from './StepPasswordAgreement';
import StepCrewProfile, { type CrewProfileData } from './StepCrewProfile';
import SignupCompleteModal from './SignupCompleteModal';

type Step = 'select-type' | 'email' | 'password' | 'profile' | 'complete';

export default function SignupFunnel() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('select-type');
  const [userType, setUserType] = useState<UserType>();
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

  function handleProfileDone(data: CrewProfileData) {
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
      {step === 'profile' && <StepCrewProfile onNext={handleProfileDone} />}
      {step === 'complete' && (
        <SignupCompleteModal
          onPortfolio={() => router.push('/')}
          onCrewInfo={() => router.push('/')}
          onClose={handleClose}
        />
      )}
    </>
  );
}
