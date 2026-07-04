'use client';

import { useState } from 'react';
import LogoConxTitle from '@/assets/icons/logo_conx_title.svg';
import { CTAButton } from '@/components/common/CTAButton';
import { TextFieldMembership } from '@/components/common/TextFieldMembership';
import { TextLineButton } from '@/components/common/TextLineButton';
import { API_ROUTES } from '@/constants/api';
import { useTimer } from '@/hooks/useTimer';
import { formatTime } from '@/utils/format';
import { validateEmail } from '@/utils/validate';

interface StepEmailVerificationProps {
  onNext: (email: string) => void;
}

const TIMER_SECONDS = 180;

export default function StepEmailVerification({ onNext }: StepEmailVerificationProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [verified, setVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const timer = useTimer(TIMER_SECONDS);

  async function sendCode() {
    const res = await fetch(API_ROUTES.AUTH.EMAIL_SEND, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      setEmailError(data.message ?? '인증번호 전송에 실패했습니다.');
      return false;
    }
    return true;
  }

  function handleSendCode() {
    if (!validateEmail(email)) {
      setEmailError('이메일을 다시 확인해 주세요');
      return;
    }
    setEmailError('');
    setCodeSent(true);
    setCode('');
    setCodeError('');
    setVerified(false);
    timer.start();
    setIsSending(true);
    sendCode()
      .then((success) => {
        if (!success) {
          setCodeSent(false);
          timer.clear();
        }
      })
      .finally(() => setIsSending(false));
  }

  function handleResendCode() {
    setCode('');
    setCodeError('');
    setVerified(false);
    timer.start();
    setIsSending(true);
    sendCode()
      .then((success) => {
        if (!success) {
          timer.clear();
        }
      })
      .finally(() => setIsSending(false));
  }

  async function handleVerify() {
    if (code.length !== 6) {
      setCodeError('인증번호가 맞지 않습니다');
      return;
    }
    setIsVerifying(true);
    try {
      const res = await fetch(API_ROUTES.AUTH.EMAIL_VERIFY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: Number(code) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCodeError(data.message ?? '인증번호가 맞지 않습니다');
        setIsVerifying(false);
        return;
      }
      setCodeError('');
      setVerified(true);
      timer.clear();
      onNext(email);
    } catch {
      setCodeError('네트워크 오류가 발생했습니다.');
      setIsVerifying(false);
    }
  }

  const canSendCode = validateEmail(email) && !codeSent && !isSending;
  const canVerify = codeSent && code.length === 6 && timer.isRunning && !isVerifying;

  return (
    <form
      className="flex flex-col items-center gap-9"
      onSubmit={(e) => {
        e.preventDefault();
        if (!codeSent) {
          handleSendCode();
        } else {
          handleVerify();
        }
      }}
    >
      <div className="flex w-full flex-col gap-13">
        <div className="flex flex-col gap-9">
          <LogoConxTitle className="h-6.25 w-28" />
          <h1 className="text-kor-title-1-bold text-conx-common-black">
            가입에 사용할 이메일을
            <br />
            인증해 주세요
          </h1>
        </div>

        <div className="flex w-114.25 flex-col gap-3">
          <label htmlFor="signup-email" className="text-kor-body-1-semibold text-conx-common-black">
            이메일
          </label>

          <div className="flex flex-col gap-3">
            <TextFieldMembership
              id="signup-email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              error={emailError}
              readOnly={codeSent}
            />

            {codeSent && (
              <TextFieldMembership
                aria-label="인증번호"
                placeholder="인증번호 6자리를 입력해주세요"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setCodeError('');
                }}
                maxLength={6}
                error={codeError}
                suffix={
                  <span className="text-kor-body-1-semibold text-conx-gray-600">
                    {formatTime(timer.remaining)}
                  </span>
                }
                action={
                  <TextLineButton onClick={handleResendCode} disabled={isSending}>
                    인증번호 재전송
                  </TextLineButton>
                }
              />
            )}
          </div>
        </div>
      </div>

      {!codeSent ? (
        <CTAButton type="submit" disabled={!canSendCode} className="w-114.5">
          {isSending ? '전송 중...' : '인증번호 전송'}
        </CTAButton>
      ) : (
        <CTAButton type="submit" disabled={!canVerify || verified} className="w-114.5">
          {isVerifying ? '확인 중...' : '인증 완료'}
        </CTAButton>
      )}
    </form>
  );
}
