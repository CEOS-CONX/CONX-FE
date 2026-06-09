'use client';

import { useState } from 'react';
import IconCompleted from '@/assets/icons/icon_completed.svg';
import IconArrowRightStroke from '@/assets/icons/icon_arrowRight_stroke.svg';
import LogoConxTitle from '@/assets/icons/logo_conx_title.svg';
import { CTAButton } from '@/components/common/CTAButton';
import { RadioButton } from '@/components/common/RadioButton';
import { TextFieldMembership } from '@/components/common/TextFieldMembership';
import { validatePassword } from '@/utils/validate';

interface StepPasswordAgreementProps {
  email: string;
  onNext: (password: string, marketingAgreed: boolean) => void;
}

interface Agreements {
  age: boolean;
  terms: boolean;
  marketing: boolean;
}

export default function StepPasswordAgreement({ email, onNext }: StepPasswordAgreementProps) {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [agreements, setAgreements] = useState<Agreements>({
    age: false,
    terms: false,
    marketing: false,
  });

  const allRequired = agreements.age && agreements.terms;
  const allChecked = agreements.age && agreements.terms && agreements.marketing;

  const passwordValid = validatePassword(password);
  const passwordsMatch = password === passwordConfirm && passwordConfirm.length > 0;

  function handleToggleAll(checked: boolean) {
    setAgreements({ age: checked, terms: checked, marketing: checked });
  }

  function handleToggle(key: keyof Agreements) {
    return (checked: boolean) => {
      setAgreements((prev) => ({ ...prev, [key]: checked }));
    };
  }

  function handlePasswordBlur() {
    if (password && !passwordValid) {
      setPasswordError('올바르지 않은 비밀번호입니다');
    } else {
      setPasswordError('');
    }
  }

  function handleConfirmBlur() {
    if (passwordConfirm && !passwordsMatch) {
      setConfirmError('비밀번호가 서로 일치하지 않습니다');
    } else {
      setConfirmError('');
    }
  }

  function handleSubmit() {
    if (!passwordValid || !passwordsMatch || !allRequired) return;
    onNext(password, agreements.marketing);
  }

  const canSubmit = passwordValid && passwordsMatch && allRequired;

  return (
    <div className="flex flex-col items-center gap-15.5">
      {/* 헤더 + 폼 필드 */}
      <div className="flex w-full flex-col gap-13">
        <div className="flex flex-col gap-9">
          <LogoConxTitle className="h-6.25 w-28" />
          <h1 className="text-kor-title-1-bold text-conx-common-black">비밀번호를 입력해주세요</h1>
        </div>

        <div className="flex flex-col gap-9">
          {/* 이메일 (읽기 전용) */}
          <div className="flex w-114.5 flex-col gap-3">
            <label
              htmlFor="signup-email-readonly"
              className="text-kor-body-1-semibold text-conx-common-black"
            >
              이메일
            </label>
            <TextFieldMembership id="signup-email-readonly" value={email} disabled />
          </div>

          {/* 비밀번호 */}
          <div className="flex w-114.5 flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <label
                htmlFor="signup-password"
                className="text-kor-body-1-semibold text-conx-common-black"
              >
                비밀번호
              </label>
              <p className="text-kor-label-1-medium text-conx-gray-450">
                영문 소대문자, 숫자, 특수문자를 혼용하여 8자 이상, 16자이하로 입력해주세요
              </p>
            </div>
            <TextFieldMembership
              id="signup-password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
              onBlur={handlePasswordBlur}
              error={passwordError}
            />
            <TextFieldMembership
              aria-label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 한 번 더 입력해주세요"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                setConfirmError('');
              }}
              onBlur={handleConfirmBlur}
              error={confirmError}
              suffix={
                passwordsMatch ? <IconCompleted className="text-conx-primary-400 h-5 w-5" /> : null
              }
            />
          </div>
        </div>
      </div>

      {/* 약관 동의 */}
      <div className="bg-conx-gray-50 flex w-114.5 flex-col rounded-md">
        <div className="p-5">
          <RadioButton checked={allChecked} onChange={handleToggleAll}>
            <span className="text-kor-body-1-semibold">모두 동의합니다.</span>
          </RadioButton>
        </div>

        <div className="border-conx-gray-150 flex flex-col gap-5 border-t p-5">
          <p className="text-kor-label-1-semibold text-conx-gray-400">
            회원 가입 및 회원 관리 등의 목적으로 이메일, 비밀번호, 휴대폰 번호 등의 정보를 수집 및
            이용하고 있습니다.
          </p>

          <div className="flex flex-col gap-2">
            <RadioButton checked={agreements.age} onChange={handleToggle('age')}>
              [필수] 만 14세 이상입니다.
            </RadioButton>

            <div className="flex items-center justify-between">
              <RadioButton
                className="w-90 shrink-0"
                checked={agreements.terms}
                onChange={handleToggle('terms')}
              >
                [필수] 서비스 이용약관에 동의합니다
              </RadioButton>
              <button
                type="button"
                aria-label="서비스 이용약관 보기"
                className="shrink-0 cursor-pointer p-1.5"
              >
                <IconArrowRightStroke className="text-conx-gray-450 h-4.5 w-4.5" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <RadioButton
                className="w-90 shrink-0"
                checked={agreements.marketing}
                onChange={handleToggle('marketing')}
              >
                [선택] 마케팅 수신 홍보목적의 개인정보 수집 및 이용에 동의합니다.
              </RadioButton>
              <button
                type="button"
                aria-label="마케팅 수신 동의 내용 보기"
                className="shrink-0 cursor-pointer p-1.5"
              >
                <IconArrowRightStroke className="text-conx-gray-450 h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CTAButton disabled={!canSubmit} onClick={handleSubmit} className="w-114.5">
        동의하기
      </CTAButton>
    </div>
  );
}
