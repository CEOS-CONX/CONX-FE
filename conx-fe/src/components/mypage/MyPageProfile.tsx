'use client';

import CompanyProfilePage from './CompanyProfilePage';
import CrewProfilePage from './CrewProfilePage';
import { useMypageIsCompany } from './useMypageRole';

// /mypage 진입점 — 크루/기업 프로필 분기. (page.tsx에서 <Suspense>로 감쌈)
export default function MyPageProfile() {
  return useMypageIsCompany() ? <CompanyProfilePage /> : <CrewProfilePage />;
}
