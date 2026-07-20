'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ChangeEmailModal from '@/components/mypage/ChangeEmailModal';
import ChangePasswordModal from '@/components/mypage/ChangePasswordModal';
import DeleteAccountModal from '@/components/mypage/DeleteAccountModal';
import EditFieldModal from '@/components/mypage/EditFieldModal';
import ListButton from '@/components/mypage/ListButton';
import { useAuth } from '@/context/AuthContext';
import { useAuthStore } from '@/stores/auth';
import { USER_TYPE } from '@/types/auth';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-kor-heading-2-bold text-conx-common-black">{children}</h2>;
}

// 단일 텍스트 필드로 편집 가능한 항목 (이메일/비밀번호는 별도 전용 팝업 — 다음에 제작)
type EditKey = 'name' | 'job' | 'phone' | 'contactEmail';
const FIELD_META: Record<EditKey, { title: string; label: string }> = {
  name: { title: '이름', label: '이름' },
  job: { title: '직무', label: '직무' },
  phone: { title: '대표 전화번호', label: '대표 전화번호' },
  contactEmail: { title: '대표 이메일', label: '대표 이메일' },
};

export default function AccountPage() {
  const router = useRouter();
  const { user } = useAuth();
  const logout = useAuthStore((s) => s.logout);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editing, setEditing] = useState<EditKey | null>(null);

  const isCompany = user?.userType === USER_TYPE.COMPANY;

  // 이름·이메일은 회원가입 필수값. 나머지는 optional — 값 없어도 라벨 행은 유지, 값만 생략(ListButton이 처리)
  // TODO: 실제 프로필 API 연결 (지금은 placeholder)
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    job?: string;
    phone?: string;
    contactEmail?: string;
  }>({
    name: '우유민',
    email: user?.email ?? '0000000@gmail.com',
    job: '마케팅 매니저',
    phone: '010-1234-5678',
  });

  // 편집 저장 — 지금은 로컬 반영만. TODO: 프로필 수정 API 연결
  function handleSaveField(key: EditKey, value: string) {
    setProfile((p) => ({ ...p, [key]: value }));
    setEditing(null);
  }

  async function handleLogout() {
    await logout();
    router.push('/'); // TODO: 로그아웃 후 이동 경로 확정 (홈 / 로그인)
  }

  return (
    <div className="w-[400px]">
      <h1 className="text-kor-title-1-bold text-conx-common-black">내 정보</h1>

      {/* 계정 — 이름·이메일은 필수(항상), 비밀번호는 변경 진입(항상) */}
      <section className="mt-12">
        <SectionTitle>계정</SectionTitle>
        <div className="mt-4">
          <ListButton label="이름" text={profile.name} onClick={() => setEditing('name')} />
          <ListButton
            label="이메일"
            text={profile.email}
            onClick={() => setShowChangeEmail(true)}
          />
          <ListButton label="비밀번호" onClick={() => setShowChangePassword(true)} />
        </div>
      </section>

      {/* 담당자 정보 (기업만) — 직무 값 없어도 라벨 행은 유지 */}
      {isCompany && (
        <section className="mt-12">
          <SectionTitle>담당자 정보</SectionTitle>
          <div className="mt-4">
            <ListButton label="직무" text={profile.job} onClick={() => setEditing('job')} />
          </div>
        </section>
      )}

      {/* 연락처 — 라벨 행은 항상, 값은 있을 때만 표시(ListButton) */}
      <section className="mt-12">
        <SectionTitle>연락처</SectionTitle>
        <div className="mt-4">
          <ListButton
            label="대표 전화번호"
            text={profile.phone}
            onClick={() => setEditing('phone')}
          />
          <ListButton
            label="대표 이메일"
            text={profile.contactEmail}
            onClick={() => setEditing('contactEmail')}
          />
        </div>
      </section>

      {/* 로그아웃 / 회원 탈퇴 */}
      <div className="mt-16 flex items-center gap-6">
        <button
          type="button"
          onClick={handleLogout}
          className="text-kor-body-1-medium text-conx-gray-450 hover:text-conx-common-black cursor-pointer transition-colors"
        >
          로그아웃
        </button>
        <button
          type="button"
          onClick={() => setShowDeleteAccount(true)}
          className="text-kor-body-1-medium text-conx-gray-450 hover:text-conx-common-black cursor-pointer transition-colors"
        >
          회원 탈퇴
        </button>
      </div>

      {/* 단일 필드 편집 팝업 */}
      {editing && (
        <EditFieldModal
          title={FIELD_META[editing].title}
          label={FIELD_META[editing].label}
          initialValue={profile[editing] ?? ''}
          onClose={() => setEditing(null)}
          onSubmit={(value) => handleSaveField(editing, value)}
        />
      )}

      {/* 이메일 변경 팝업 (비밀번호 확인 + 새 이메일 인증) */}
      {showChangeEmail && (
        <ChangeEmailModal
          onClose={() => setShowChangeEmail(false)}
          onSuccess={(newEmail) => {
            setProfile((p) => ({ ...p, email: newEmail }));
            setShowChangeEmail(false);
          }}
        />
      )}

      {/* 비밀번호 변경 팝업 (기존 확인 + 새 비밀번호 규칙·일치) */}
      {showChangePassword && (
        <ChangePasswordModal
          onClose={() => setShowChangePassword(false)}
          onSuccess={() => setShowChangePassword(false)}
        />
      )}

      {/* 회원 탈퇴 팝업 (비밀번호 확인) — 성공 시 홈으로 */}
      {showDeleteAccount && (
        <DeleteAccountModal
          onClose={() => setShowDeleteAccount(false)}
          onSuccess={() => router.push('/')}
        />
      )}
    </div>
  );
}
