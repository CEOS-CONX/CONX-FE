'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import IconClose from '@/assets/icons/icon_delete.svg';
import { Button } from '@/components/common/Button';
import { TextFieldMembership } from '@/components/common/TextFieldMembership';
import { TextLineButton } from '@/components/common/TextLineButton';
import { API_ROUTES } from '@/constants/api';
import { useDialog } from '@/hooks/useDialog';
import { useTimer } from '@/hooks/useTimer';
import { formatTime } from '@/utils/format';
import { validateEmail } from '@/utils/validate';

interface ChangeEmailModalProps {
  onClose: () => void;
  onSuccess: (newEmail: string) => void;
}

const TIMER_SECONDS = 180; // 인증번호 유효시간 3:00

// 이메일 변경 팝업 — ① 비밀번호+새 이메일 → 인증번호 받기 ② 인증번호 입력 → 저장하기
export default function ChangeEmailModal({ onClose, onSuccess }: ChangeEmailModalProps) {
  const router = useRouter();
  const dialogRef = useDialog<HTMLDivElement>(onClose); // Esc·스크롤 잠금·포커스 트랩/복귀
  const timer = useTimer(TIMER_SECONDS);

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // useDialog가 X버튼으로 옮긴 포커스를 비밀번호 입력창으로 되돌림
  useEffect(() => {
    dialogRef.current?.querySelector<HTMLInputElement>('#change-email-password')?.focus();
  }, [dialogRef]);

  // 새 이메일로 인증번호 발송
  async function sendCode() {
    const res = await fetch(API_ROUTES.AUTH.EMAIL_SEND, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setEmailError(data.message ?? '인증번호 전송에 실패했습니다.');
      return false;
    }
    return true;
  }

  function handleSendCode() {
    if (!password.trim() || !validateEmail(email) || isSending) return;
    setEmailError('');
    setCodeError('');
    setCode('');
    setCodeSent(true);
    timer.start();
    setIsSending(true);
    sendCode()
      .then((ok) => {
        if (!ok) {
          setCodeSent(false);
          timer.clear();
        }
      })
      .finally(() => setIsSending(false));
  }

  function handleResendCode() {
    setCode('');
    setCodeError('');
    timer.start();
    setIsSending(true);
    sendCode()
      .then((ok) => {
        if (!ok) timer.clear();
      })
      .finally(() => setIsSending(false));
  }

  // 저장하기 — 인증번호 확인 후 이메일 변경
  async function handleSave() {
    if (code.length !== 6 || !timer.isRunning || isSaving) return;
    setIsSaving(true);
    setCodeError('');
    try {
      const res = await fetch(API_ROUTES.AUTH.EMAIL_VERIFY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: Number(code) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCodeError(data.message ?? '인증번호가 맞지 않습니다');
        setIsSaving(false);
        return;
      }
      // TODO: 실제 이메일 변경 API(현재 비밀번호 검증 포함) 연결 — 확인되면 여기서 호출
      timer.clear();
      onSuccess(email);
    } catch {
      setCodeError('네트워크 오류가 발생했습니다.');
      setIsSaving(false);
    }
  }

  const canSendCode = !!password.trim() && validateEmail(email) && !isSending;
  const canSave = codeSent && code.length === 6 && timer.isRunning && !isSaving;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-email-title"
      onClick={onClose}
      className="bg-conx-opacity-gray-30 z-conx-modal fixed inset-0 flex items-center justify-center px-4"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (!codeSent) handleSendCode();
          else handleSave();
        }}
        className="bg-conx-common-white shadow-conx-drop-gray-15 relative w-[506px] rounded-md px-6 py-5"
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="hover:bg-conx-opacity-gray-6 absolute top-5 right-6 flex cursor-pointer items-center justify-center rounded-md p-1"
        >
          <IconClose className="[&_path]:stroke-conx-common-black h-6 w-6" />
        </button>

        <h2 id="change-email-title" className="text-kor-heading-3-bold text-conx-common-black">
          이메일 변경
        </h2>
        <p className="text-kor-label-1-medium text-conx-gray-450 mt-2">
          계정 보호를 위해 현재 비밀번호 확인 후 이메일을 변경할 수 있어요
        </p>

        {/* 비밀번호 */}
        <div className="mt-8 flex flex-col gap-3">
          <label
            htmlFor="change-email-password"
            className="text-kor-label-1-medium text-conx-gray-350"
          >
            비밀번호
          </label>
          <TextFieldMembership
            id="change-email-password"
            type="password"
            placeholder="내용을 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* 새 이메일 (+ 인증번호) */}
        <div className="mt-6 flex flex-col gap-3">
          <label htmlFor="change-email-new" className="text-kor-label-1-medium text-conx-gray-350">
            새 이메일
          </label>
          <div className="flex flex-col gap-3">
            <TextFieldMembership
              id="change-email-new"
              type="email"
              placeholder="내용을 입력해주세요"
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

        {/* 하단 — ①: 비밀번호 찾기 + 인증번호 받기, ②: 저장하기 */}
        {!codeSent ? (
          <div className="mt-8 flex items-center justify-between">
            <TextLineButton onClick={() => router.push('/find-account')}>
              비밀번호를 잊으셨나요?
            </TextLineButton>
            <Button variant="primary" disabled={!canSendCode} onClick={handleSendCode}>
              {isSending ? '전송 중...' : '인증번호 받기'}
            </Button>
          </div>
        ) : (
          <div className="mt-8 flex justify-end">
            <Button variant="primary" disabled={!canSave} onClick={handleSave}>
              {isSaving ? '변경 중...' : '저장하기'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
