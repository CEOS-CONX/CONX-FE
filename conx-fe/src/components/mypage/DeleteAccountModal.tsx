'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import IconClose from '@/assets/icons/icon_delete.svg';
import { Button } from '@/components/common/Button';
import { TextFieldMembership } from '@/components/common/TextFieldMembership';
import { TextLineButton } from '@/components/common/TextLineButton';
import { useDialog } from '@/hooks/useDialog';
import { useAuthStore } from '@/stores/auth';

interface DeleteAccountModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteAccountModal({ onClose, onSuccess }: DeleteAccountModalProps) {
  const router = useRouter();
  const dialogRef = useDialog(onClose); // Esc·스크롤 잠금·포커스 트랩/복귀
  const deleteAccount = useAuthStore((s) => s.deleteAccount);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleDeleteAccount() {
    if (!password.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    const result = await deleteAccount(password);
    setSubmitting(false);
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error ?? '회원 탈퇴에 실패했습니다.');
    }
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
      onClick={onClose}
      className="bg-conx-opacity-gray-30 z-conx-modal fixed inset-0 flex items-center justify-center px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-conx-common-white relative w-[506px] rounded-md px-6 py-5"
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="hover:bg-conx-opacity-gray-6 absolute top-5 right-6 flex cursor-pointer items-center justify-center rounded-md p-1"
        >
          <IconClose className="[&_path]:stroke-conx-common-black h-6 w-6" />
        </button>

        <h2 id="delete-account-title" className="text-kor-heading-3-bold text-conx-common-black">
          회원 탈퇴
        </h2>
        <p className="text-kor-label-1-medium text-conx-gray-450 mt-2">
          탈퇴 신청 후 7일 동안 계정이 비활성화됩니다.
          <br />
          7일 이내 다시 로그인하면 계정을 복구할 수 있어요.
        </p>

        {/* 비밀번호 */}
        <div className="mt-8 flex flex-col gap-3">
          <label
            htmlFor="delete-account-password"
            className="text-kor-label-1-medium text-conx-gray-350"
          >
            비밀번호
          </label>
          <TextFieldMembership
            id="delete-account-password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            error={error || undefined}
          />
        </div>

        {/* 비밀번호 찾기 + 탈퇴하기 (입력창에서 40px 아래) */}
        <div className="mt-10 flex items-center justify-between">
          <TextLineButton onClick={() => router.push('/find-account')}>
            비밀번호를 잊으셨나요?
          </TextLineButton>
          <Button
            variant="primary"
            disabled={!password.trim() || submitting}
            onClick={handleDeleteAccount}
          >
            탈퇴하기
          </Button>
        </div>
      </div>
    </div>
  );
}
