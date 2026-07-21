'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import LogoConxTitle from '@/assets/icons/logo_conx_title.svg';
import { CTAButton } from '@/components/common/CTAButton';
import { TextFieldInput } from '@/components/common/TextFieldInput';
import { useAuthStore } from '@/stores/auth';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let hasError = false;

    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요');
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해주세요');
      hasError = true;
    }
    if (hasError) return;

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setEmailError('이메일 또는 비밀번호를 다시 확인해 주세요');
      return;
    }

    const redirect = searchParams.get('redirect') ?? '/';
    router.push(redirect);
  }

  return (
    <div className="mb-100 flex flex-col gap-12">
      <div className="flex w-28 flex-col gap-9">
        <LogoConxTitle className="h-6.25 w-28" />
        <h1 className="text-kor-title-1-bold text-conx-common-black">로그인</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-15.5">
        <div className="flex flex-col gap-9">
          <TextFieldInput
            size="lg"
            label="이메일"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            error={emailError}
          />
          <TextFieldInput
            size="lg"
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError('');
            }}
            error={passwordError}
          />
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex w-114.5 flex-col gap-3">
            <CTAButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? '로그인 중...' : '로그인'}
            </CTAButton>
            <CTAButton variant="tertiary" href="/find-account">
              이메일·비밀번호 찾기
            </CTAButton>
          </div>

          <div className="flex items-center gap-5.5">
            <span className="text-kor-label-1-medium text-conx-gray-450">
              아직 커넥스 회원이 아니신가요?
            </span>
            <Link
              href="/signup"
              className="text-kor-label-1-medium text-conx-gray-450 border-conx-gray-450 border-b"
            >
              회원가입하기
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
