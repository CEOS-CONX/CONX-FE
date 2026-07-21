'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFunnel } from '@use-funnel/browser';
import { API_ROUTES } from '@/constants/api';
import { USER_TYPE, type UserType } from '@/types/auth';
import SignupCompleteModal from './SignupCompleteModal';
import StepCompanyProfile, { type CompanyProfileData } from './StepCompanyProfile';
import StepCrewProfile, { type CrewProfileData } from './StepCrewProfile';
import StepEmailVerification from './StepEmailVerification';
import StepPasswordAgreement from './StepPasswordAgreement';
import StepSelectType from './StepSelectType';

interface SelectTypeContext {
  userType?: UserType;
  email?: string;
}

interface EmailContext {
  userType: UserType;
  email?: string;
}

interface PasswordContext {
  userType: UserType;
  email: string;
  userinfoRegistered?: boolean;
}

interface ProfileContext {
  userType: UserType;
  email: string;
  userinfoRegistered: true;
}

interface SignupFunnelProps {
  initialType?: UserType;
}

export default function SignupFunnel({ initialType }: SignupFunnelProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [completedUserType, setCompletedUserType] = useState<UserType | null>(null);

  useEffect(() => {
    if (!completedUserType) return;
    window.history.replaceState(null, '', '/signup');
    const onPopState = () => {
      window.location.replace('/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [completedUserType]);

  const funnel = useFunnel<{
    SelectType: SelectTypeContext;
    Email: EmailContext;
    Password: PasswordContext;
    Profile: ProfileContext;
  }>({
    id: 'signup-funnel',
    initial: initialType
      ? { step: 'Email', context: { userType: initialType } }
      : { step: 'SelectType', context: {} },
  });

  async function handlePasswordDone(
    context: PasswordContext,
    pw: string,
    marketing: boolean,
    pushToProfile: (ctx: ProfileContext) => void,
  ) {
    if (context.userinfoRegistered) {
      pushToProfile({ ...context, userinfoRegistered: true });
      return;
    }

    setError('');
    try {
      const res = await fetch(API_ROUTES.AUTH.SIGNUP_USERINFO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userType: context.userType,
          email: context.email,
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
      pushToProfile({ ...context, userinfoRegistered: true });
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    }
  }

  async function handleProfileDone(
    context: ProfileContext,
    data: CrewProfileData | CompanyProfileData,
  ) {
    setError('');
    const endpoint =
      context.userType === USER_TYPE.COMPANY
        ? API_ROUTES.AUTH.SIGNUP_COMPANY
        : API_ROUTES.AUTH.SIGNUP_CREW;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: context.email, ...data }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message ?? '프로필 등록에 실패했습니다.');
        return;
      }
      setCompletedUserType(context.userType);
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    }
  }

  // 가입 완료 — 퍼널 바깥에서 모달만 렌더링
  if (completedUserType) {
    return (
      <SignupCompleteModal
        userType={completedUserType}
        onPrimaryAction={() =>
          router.replace(
            completedUserType === USER_TYPE.COMPANY ? '/project-create' : '/crew-workspace',
          )
        }
        onSecondaryAction={() => router.replace('/')}
        onClose={() => router.replace('/')}
      />
    );
  }

  return (
    <>
      {error && <p className="text-kor-body-2-medium mb-4 text-center text-red-500">{error}</p>}
      <funnel.Render
        SelectType={({ history }) => (
          <StepSelectType onSelect={(type) => history.push('Email', { userType: type })} />
        )}
        Email={({ context, history }) => (
          <StepEmailVerification
            initialEmail={context.email}
            onNext={(email) => {
              history.replace('Email', { ...context, email });
              history.push('Password', { ...context, email });
            }}
          />
        )}
        Password={({ context, history }) => (
          <StepPasswordAgreement
            email={context.email}
            onNext={(pw, marketing) =>
              handlePasswordDone(context, pw, marketing, (ctx) => {
                history.replace('Password', ctx);
                history.push('Profile', ctx);
              })
            }
          />
        )}
        Profile={({ context }) =>
          context.userType === USER_TYPE.CREW ? (
            <StepCrewProfile onNext={(data) => handleProfileDone(context, data)} />
          ) : (
            <StepCompanyProfile onNext={(data) => handleProfileDone(context, data)} />
          )
        }
      />
    </>
  );
}
