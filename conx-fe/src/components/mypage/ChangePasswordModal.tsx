'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import IconCompleted from '@/assets/icons/icon_completed.svg';
import IconClose from '@/assets/icons/icon_delete.svg';
import { Button } from '@/components/common/Button';
import { TextFieldMembership } from '@/components/common/TextFieldMembership';
import { TextLineButton } from '@/components/common/TextLineButton';
import { useDialog } from '@/hooks/useDialog';
import { validatePassword } from '@/utils/validate';

interface ChangePasswordModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const NEW_PW_MAX = 35; // 입력 카운터 상한 (유효 범위는 8~16, validatePassword로 검증)

// 비밀번호 변경 팝업 — 기존 비밀번호 확인 + 새 비밀번호(규칙 검증) + 재입력 일치
export default function ChangePasswordModal({ onClose, onSuccess }: ChangePasswordModalProps) {
  const router = useRouter();
  const dialogRef = useDialog<HTMLDivElement>(onClose); // Esc·스크롤 잠금·포커스 트랩/복귀

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [nextError, setNextError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [currentError, setCurrentError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // useDialog가 X버튼으로 옮긴 포커스를 기존 비밀번호 입력창으로 되돌림
  useEffect(() => {
    dialogRef.current?.querySelector<HTMLInputElement>('#change-pw-current')?.focus();
  }, [dialogRef]);

  const nextValid = validatePassword(next);
  const matched = next === confirm && confirm.length > 0;
  const canSave = !!current.trim() && nextValid && matched && !isSaving;

  function handleNextBlur() {
    setNextError(next && !nextValid ? '올바르지 않은 비밀번호입니다' : '');
  }

  function handleConfirmBlur() {
    setConfirmError(confirm && !matched ? '비밀번호가 서로 일치하지 않습니다' : '');
  }

  async function handleSave() {
    if (!canSave) return;
    setIsSaving(true);
    setCurrentError('');
    // TODO: 실제 비밀번호 변경 API 연결 (현재 비밀번호 검증 포함) — 엔드포인트 확정되면 여기서 호출
    onSuccess();
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-pw-title"
      onClick={onClose}
      className="bg-conx-opacity-gray-30 z-conx-modal fixed inset-0 flex items-center justify-center px-4"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
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

        <h2 id="change-pw-title" className="text-kor-heading-3-bold text-conx-common-black">
          비밀번호 변경
        </h2>
        <p className="text-kor-label-1-medium text-conx-gray-450 mt-2">
          영문 소대문자, 숫자, 특수문자를 혼용하여
          <br />
          8자 이상, 16자이하로 입력해주세요
        </p>

        {/* 기존 비밀번호 */}
        <div className="mt-8 flex flex-col gap-3">
          <label htmlFor="change-pw-current" className="text-kor-label-1-medium text-conx-gray-350">
            기존 비밀번호
          </label>
          <TextFieldMembership
            id="change-pw-current"
            type="password"
            placeholder="기존 비밀번호를 입력해주세요"
            value={current}
            onChange={(e) => {
              setCurrent(e.target.value);
              setCurrentError('');
            }}
            error={currentError}
          />
        </div>

        {/* 새 비밀번호 (+ 재입력) */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label htmlFor="change-pw-new" className="text-kor-label-1-medium text-conx-gray-350">
              새 비밀번호
            </label>
            <span className="text-kor-label-1-medium text-conx-gray-300">
              {next.length}/{NEW_PW_MAX}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <TextFieldMembership
              id="change-pw-new"
              type="password"
              placeholder="새 비밀번호를 입력해주세요"
              maxLength={NEW_PW_MAX}
              value={next}
              onChange={(e) => {
                setNext(e.target.value);
                setNextError('');
              }}
              onBlur={handleNextBlur}
              error={nextError}
            />
            <TextFieldMembership
              aria-label="새 비밀번호 확인"
              type="password"
              placeholder="비밀번호를 한 번 더 입력해주세요"
              maxLength={NEW_PW_MAX}
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setConfirmError('');
              }}
              onBlur={handleConfirmBlur}
              error={confirmError}
              suffix={matched ? <IconCompleted className="text-conx-primary-400 h-5 w-5" /> : null}
            />
          </div>
        </div>

        {/* 하단 — 비밀번호 찾기 + 저장하기 */}
        <div className="mt-8 flex items-center justify-between">
          <TextLineButton onClick={() => router.push('/find-account')}>
            비밀번호를 잊으셨나요?
          </TextLineButton>
          <Button variant="primary" disabled={!canSave} onClick={handleSave}>
            {isSaving ? '변경 중...' : '저장하기'}
          </Button>
        </div>
      </form>
    </div>
  );
}
