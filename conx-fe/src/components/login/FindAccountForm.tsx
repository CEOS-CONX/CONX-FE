'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import LogoConxTitle from '@/assets/icons/logo_conx_title.svg';
import { CTAButton } from '@/components/common/CTAButton';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import { TextFieldInput } from '@/components/common/TextFieldInput';
import { TextFieldMembership } from '@/components/common/TextFieldMembership';
import { TextLineButton } from '@/components/common/TextLineButton';
import { Toast } from '@/components/common/Toast';
import { API_ROUTES } from '@/constants/api';
import { useTimer } from '@/hooks/useTimer';
import { formatTime } from '@/utils/format';
import { validateEmail } from '@/utils/validate';

type Tab = 'email' | 'password';

const TAB_CONFIG: Record<Tab, { label: string; helperText: string; toastMessage: string }> = {
  email: {
    label: '이메일 찾기',
    helperText: '이메일 인증 후, 가입에 사용한 이메일 주소를 보내드려요',
    toastMessage: '가입 시 등록한 이메일 계정을 보냈습니다',
  },
  password: {
    label: '비밀번호 찾기',
    helperText: '가입 시 등록한 이메일을 확인한 뒤, 비밀번호를 보내드려요.',
    toastMessage: '비밀번호를 보냈습니다',
  },
};

const TIMER_SECONDS = 180;

export default function FindAccountForm() {
  const [activeTab, setActiveTab] = useState<Tab>('email');
  const [name, setName] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [emailError, setEmailError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const timer = useTimer(TIMER_SECONDS);

  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const canSendCode = name.trim() && validateEmail(emailValue) && !isSending;
  const canVerify = codeSent && code.length === 6 && timer.isRunning && !isVerifying;

  async function handleSendCode() {
    if (!canSendCode) return;

    if (activeTab === 'password') {
      setIsSending(true);
      try {
        const res = await fetch(API_ROUTES.AUTH.PASSWORD_RESET_SEND, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), email: emailValue }),
        });
        const data = await res.json();
        if (!res.ok) {
          setEmailError(data.message ?? '인증번호 전송에 실패했습니다.');
          return;
        }
        setCodeSent(true);
        setCode('');
        setCodeError('');
        timer.start();
      } finally {
        setIsSending(false);
      }
    } else {
      // 이메일 찾기 — API 미구현
      setCodeSent(true);
      setCode('');
      setCodeError('');
      timer.start();
    }
  }

  async function handleResendCode() {
    setCode('');
    setCodeError('');

    if (activeTab === 'password') {
      setIsSending(true);
      try {
        const res = await fetch(API_ROUTES.AUTH.PASSWORD_RESET_SEND, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), email: emailValue }),
        });
        const data = await res.json();
        if (!res.ok) {
          setCodeError(data.message ?? '인증번호 재전송에 실패했습니다.');
          return;
        }
        timer.start();
      } finally {
        setIsSending(false);
      }
    } else {
      timer.start();
    }
  }

  async function handleVerify() {
    if (!canVerify) return;

    if (activeTab === 'password') {
      setIsVerifying(true);
      try {
        const res = await fetch(API_ROUTES.AUTH.PASSWORD_RESET_CONFIRM, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailValue, code: Number(code) }),
        });
        const data = await res.json();
        if (!res.ok) {
          setCodeError(data.message ?? '인증번호가 맞지 않습니다');
          return;
        }
        timer.clear();
        setToastMessage(TAB_CONFIG[activeTab].toastMessage);
      } finally {
        setIsVerifying(false);
      }
    } else {
      // 이메일 찾기 — API 미구현
      timer.clear();
      setToastMessage(TAB_CONFIG[activeTab].toastMessage);
    }
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setName('');
    setEmailValue('');
    setEmailError('');
    setCodeSent(false);
    setCode('');
    setCodeError('');
    setToastMessage('');
    timer.clear();
  }

  const handleToastClose = useCallback(() => setToastMessage(''), []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-9">
        <Link href="/login">
          <LogoConxTitle className="h-6.25 w-28" />
        </Link>
        <h1 className="text-kor-title-1-bold text-conx-common-black">계정 찾기</h1>
      </div>

      <div className="flex flex-col items-center gap-15.5">
        <div className="flex flex-col gap-11.5">
          <SegmentedControl
            items={[
              { value: 'email', label: '이메일 찾기' },
              { value: 'password', label: '비밀번호 찾기' },
            ]}
            value={activeTab}
            onChange={handleTabChange}
          />

          {/* 입력 필드 */}
          <form
            className="flex flex-col gap-9"
            onSubmit={(e) => {
              e.preventDefault();
              if (!codeSent) handleSendCode();
              else handleVerify();
            }}
          >
            <TextFieldInput
              size="lg"
              label="이름"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              <TextFieldInput
                size="lg"
                label="이메일"
                helperText={TAB_CONFIG[activeTab].helperText}
                placeholder="이메일을 입력해주세요"
                value={emailValue}
                onChange={(e) => {
                  setEmailValue(e.target.value);
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
                    <TextLineButton onClick={handleResendCode}>인증번호 재전송</TextLineButton>
                  }
                />
              )}
            </div>

            <div className="relative">
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2"
              >
                {toastMessage && (
                  <Toast
                    message={toastMessage}
                    onClose={handleToastClose}
                    className="z-conx-toast"
                  />
                )}
              </div>
              {!codeSent ? (
                <CTAButton type="submit" disabled={!canSendCode}>
                  인증번호 전송
                </CTAButton>
              ) : (
                <CTAButton type="submit" disabled={!canVerify}>
                  인증 완료
                </CTAButton>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
