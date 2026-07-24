'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownForm } from '@/components/common/DropdownForm';
import { Toast } from '@/components/common/Toast';
import PageIntro from '@/components/mypage/PageIntro';
import ProfileImage from '@/components/mypage/ProfileImage';
import ProfileRegisterModal from '@/components/mypage/ProfileRegisterModal';
import TextFieldNumber from '@/components/mypage/TextFieldNumber';
import TextFieldLabeled from '@/components/mypage/TextFieldLabeled';
import TextFieldUrl from '@/components/mypage/TextFieldUrl';
import { FieldLabel, SectionTitle } from './profileForm';

const INDUSTRY_OPTIONS = [
  { value: 'beauty', label: '뷰티' },
  { value: 'fashion', label: '패션' },
  { value: 'it', label: 'IT 플랫폼' },
  { value: 'lifestyle', label: '라이프스타일' },
  { value: 'education', label: '교육' },
  { value: 'commerce', label: '커머스' },
  { value: 'fnb', label: '음료 / F&B' },
  { value: 'health', label: '헬스 / 웰니스' },
];

// 도메인만 입력 시 https:// 를 붙여 반환. 명백히 URL 형식이 아니면 valid:false
// (빈 값은 선택 항목이라 통과)
function normalizeUrl(raw: string): { value: string; valid: boolean } {
  const trimmed = raw.trim();
  if (!trimmed) return { value: '', valid: true };
  if (trimmed.includes('@')) return { value: trimmed, valid: false }; // 이메일/유저정보 형태 배제
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withProtocol);
    if (u.username || u.password) return { value: trimmed, valid: false };
    // 호스트: 점(.)으로 구분된 라벨 + TLD 2자 이상, 연속 점·빈 라벨 불가
    const hostOk = /^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(u.hostname);
    if (!hostOk) return { value: trimmed, valid: false };
    return { value: withProtocol, valid: true };
  } catch {
    return { value: trimmed, valid: false };
  }
}

export default function CompanyProfilePage() {
  const router = useRouter();
  const [profileSrc, setProfileSrc] = useState<string>();
  const [toast, setToast] = useState<{
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);
  const [companyName, setCompanyName] = useState('CEOS 세오스');
  const [industry, setIndustry] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [intro, setIntro] = useState('');
  const [urlName, setUrlName] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [businessError, setBusinessError] = useState<string>();
  const [websiteError, setWebsiteError] = useState<string>();
  const [showRegister, setShowRegister] = useState(false);

  // 프로필 등록 클릭 → 저장 전 검증. 통과하면 확인 팝업, 아니면 인라인 에러
  function handleRegisterClick() {
    // 사업자등록번호: 선택 항목. 입력했다면 숫자 10자리여야 함 (미만이면 에러)
    const digits = businessNumber.replace(/\D/g, '');
    const bizInvalid = digits.length > 0 && digits.length < 10;
    setBusinessError(bizInvalid ? '올바른 사업자등록번호 형식으로 입력해 주세요' : undefined);

    // 웹사이트: 선택 항목. 도메인만 입력 시 https:// 자동 부착, 형식 아니면 에러
    const norm = normalizeUrl(urlValue);
    setWebsiteError(norm.valid ? undefined : '올바른 링크 형식으로 입력해주세요');

    if (bizInvalid || !norm.valid) return;

    // 정상 저장: 도메인만 입력했다면 https:// 붙은 값으로 반영
    if (norm.value !== urlValue) setUrlValue(norm.value);
    setShowRegister(true);
  }

  // 프로필 등록하기 → (API 연동 예정) 등록 후 토스트
  function handleRegister() {
    const payload = {
      profileImage: profileSrc,
      companyName,
      industry,
      businessNumber,
      intro,
      url: { name: urlName, value: urlValue },
    };
    // TODO: 실제 등록 API 연동
    console.log('기업 프로필 등록', payload);
    setShowRegister(false);
    setToast({ message: '기업 프로필이 등록되었어요' });
  }

  // 페이지에서 나가기 → 기업 프로필로 오기 직전 페이지로
  function handleLeave() {
    setShowRegister(false);
    router.back();
  }

  return (
    <div className="w-[939px]">
      <PageIntro
        title="기업 프로필"
        subText="크루가 프로젝트를 이해하고 신뢰할 수 있도록 기업 정보를 관리해 주세요."
        buttonLabel="프로필 등록"
        onButtonClick={handleRegisterClick}
      />

      {/* ── 기본 정보 ── */}
      <section className="mt-10 flex flex-col gap-6">
        <SectionTitle>기본 정보</SectionTitle>
        <ProfileImage
          src={profileSrc}
          onSelect={(f) => setProfileSrc(URL.createObjectURL(f))}
          onRemove={() => {
            const removed = profileSrc;
            setProfileSrc(undefined);
            setToast({
              message: '프로필 이미지가 삭제되었습니다.',
              actionLabel: '되돌리기',
              onAction: () => {
                setProfileSrc(removed);
                setToast(null);
              },
            });
          }}
        />
        <TextFieldLabeled
          id="company-name"
          label="기업명"
          required
          value={companyName}
          onChange={setCompanyName}
        />
        {/* 업종 · 사업자등록번호 */}
        <div className="flex justify-between">
          <div className="flex w-[457px] flex-col gap-3">
            <FieldLabel required>업종</FieldLabel>
            <DropdownForm options={INDUSTRY_OPTIONS} value={industry} onChange={setIndustry} />
          </div>
          <div className="w-[457px]">
            <TextFieldNumber
              format="businessNumber"
              id="business-number"
              value={businessNumber}
              onChange={(v) => {
                setBusinessNumber(v);
                setBusinessError(undefined);
              }}
              error={businessError}
            />
          </div>
        </div>
        <TextFieldLabeled
          id="company-intro"
          label="기업 소개글"
          value={intro}
          onChange={setIntro}
        />
        <TextFieldUrl
          id="company-url"
          label="웹사이트"
          name={urlName}
          url={urlValue}
          onNameChange={setUrlName}
          onUrlChange={(v) => {
            setUrlValue(v);
            setWebsiteError(undefined);
          }}
          error={websiteError}
        />
      </section>

      {showRegister && (
        <ProfileRegisterModal
          onRegister={handleRegister}
          onLeave={handleLeave}
          onClose={() => setShowRegister(false)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
