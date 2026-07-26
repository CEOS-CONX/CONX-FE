'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toast } from '@/components/common/Toast';
import ChangeEmailModal from '@/components/mypage/ChangeEmailModal';
import ChangePasswordModal from '@/components/mypage/ChangePasswordModal';
import DeleteAccountModal from '@/components/mypage/DeleteAccountModal';
import EditFieldModal from '@/components/mypage/EditFieldModal';
import ListButton from '@/components/mypage/ListButton';
import { useMypageIsCompany } from '@/components/mypage/useMypageRole';
import { useAuth } from '@/context/AuthContext';
import { useAuthStore } from '@/stores/auth';

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

// 필드별 백엔드 엔드포인트 세그먼트 + 바디 키 (PATCH /companies/me/account/{path})
const FIELD_ENDPOINT: Record<EditKey, { path: string; bodyKey: string }> = {
  name: { path: 'name', bodyKey: 'name' },
  job: { path: 'job', bodyKey: 'job' },
  phone: { path: 'representative-phone', bodyKey: 'representativePhone' },
  contactEmail: { path: 'representative-email', bodyKey: 'representativeEmail' },
};

// 내 정보(계정/담당자 정보/연락처) — ?as= 미리보기(useSearchParams)를 쓰므로 page.tsx에서 <Suspense>로 감쌈
export default function AccountView() {
  const router = useRouter();
  const { user } = useAuth();
  const logout = useAuthStore((s) => s.logout);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editing, setEditing] = useState<EditKey | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const isCompany = useMypageIsCompany();
  const accountBase = isCompany ? 'companies' : 'crews'; // 계정 API 경로 (기업/크루)

  // 이름·이메일은 회원가입 필수값. 나머지는 optional — 값 없어도 라벨 행은 유지, 값만 생략(ListButton이 처리)
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    job?: string;
    phone?: string;
    contactEmail?: string;
  }>({
    name: '',
    email: user?.email ?? '',
  });

  // 계정 정보 조회 → 폼 채우기 (기업/크루 각 엔드포인트. 크루는 job 없음)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/${accountBase}/me/account`);
        if (!res.ok) return;
        const data = await res.json();
        const a = data.payload;
        if (!a || cancelled) return;
        setProfile({
          name: a.name ?? '',
          email: a.email ?? '',
          job: a.job || undefined,
          phone: a.representativePhone || undefined,
          contactEmail: a.representativeEmail || undefined,
        });
      } catch {
        /* 조회 실패 시 기존 값 유지 */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accountBase]);

  // 편집 저장 — 단일 필드 PATCH (이름/전화/대표이메일: 백엔드가 currentPassword 요구 제거해서 값만 전송)
  async function handleSaveField(key: EditKey, value: string) {
    const meta = FIELD_ENDPOINT[key];
    try {
      const res = await fetch(`/api/${accountBase}/me/account/${meta.path}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [meta.bodyKey]: value }),
      });
      setEditing(null);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setToast(data.message ?? '수정에 실패했습니다.');
        return;
      }
      setProfile((p) => ({ ...p, [key]: value }));
      setToast('수정되었습니다.');
    } catch {
      setEditing(null);
      setToast('수정에 실패했습니다. 다시 시도해 주세요.');
    }
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
          accountBase={accountBase}
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
          accountBase={accountBase}
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

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
