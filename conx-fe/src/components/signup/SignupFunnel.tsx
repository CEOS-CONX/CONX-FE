'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ROUTES } from '@/constants/api';
import { USER_TYPE, type UserType } from '@/types/auth';
import StepSelectType from './StepSelectType';
import StepEmailVerification from './StepEmailVerification';
import StepPasswordAgreement from './StepPasswordAgreement';
import StepCrewProfile, { type CrewProfileData } from './StepCrewProfile';
import StepCompanyProfile, { type CompanyProfileData } from './StepCompanyProfile';
import SignupCompleteModal from './SignupCompleteModal';

type Step = 'select-type' | 'email' | 'password' | 'profile' | 'complete';

interface SignupFunnelProps {
  initialType?: UserType;
}

export default function SignupFunnel({ initialType }: SignupFunnelProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(initialType ? 'email' : 'select-type');
  const [userType, setUserType] = useState<UserType | undefined>(initialType);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function handleSelectType(type: UserType) {
    setUserType(type);
    setStep('email');
  }

  function handleEmailVerified(verifiedEmail: string) {
    setEmail(verifiedEmail);
    setStep('password');
  }

  async function handlePasswordDone(pw: string, marketing: boolean) {
    setError('');

    try {
      const res = await fetch(API_ROUTES.AUTH.SIGNUP_USERINFO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userType,
          email,
          password: pw,
          passwordCheck: pw,
          options: {
            personalInformation: true,
            sendingPromoteMessage: marketing,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? '회원가입에 실패했습니다.');
        return;
      }
      setStep('profile');
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    }
  }

  async function handleProfileDone(data: CrewProfileData | CompanyProfileData) {
    setError('');

    const endpoint =
      userType === USER_TYPE.COMPANY ? API_ROUTES.AUTH.SIGNUP_COMPANY : API_ROUTES.AUTH.SIGNUP_CREW;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ...data }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message ?? '프로필 등록에 실패했습니다.');
        return;
      }
      setStep('complete');
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    }
  }

  function handleClose() {
    router.push('/');
  }

  return (
    <>
      {error && <p className="text-kor-body-2-medium mb-4 text-center text-red-500">{error}</p>}
      {step === 'select-type' && <StepSelectType onSelect={handleSelectType} />}
      {step === 'email' && <StepEmailVerification onNext={handleEmailVerified} />}
      {step === 'password' && <StepPasswordAgreement email={email} onNext={handlePasswordDone} />}
      {step === 'profile' && userType === USER_TYPE.CREW && (
        <StepCrewProfile onNext={handleProfileDone} />
      )}
      {step === 'profile' && userType === USER_TYPE.COMPANY && (
        <StepCompanyProfile onNext={handleProfileDone} />
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
