import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { SITE_URL } from '@/lib/site';
import './globals.css';

// OG 이미지 경로 (public/images/OG_image.png — 1200×630 PNG)
const OG_IMAGE_URL = '/images/OG_image.png';
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

const suit = localFont({
  src: '../assets/fonts/SUIT-Variable.woff2',
  variable: '--font-suit-face',
  weight: '100 900',
  display: 'swap',
});

const plusJakartaSans = localFont({
  src: '../assets/fonts/PlusJakartaSans-Variable.woff2',
  variable: '--font-jakarta-face',
  weight: '100 900',
  display: 'swap',
});

/* ========== Metadata ========== */

const SITE_DESCRIPTION =
  'CONX는 기업·브랜드와 대학생 크루를 연결해 20대 인사이트 확보, 콘텐츠 제작, 기업 연계 프로젝트를 빠르게 실행하도록 돕는 매칭 플랫폼입니다.';

const OG_TITLE = 'CONX | 20대 타깃이면, 20대가 직접 움직여야 하니까';

// 검색엔진 사이트 소유권 인증 코드 — 각 콘솔에서 발급받은 content 값
// Google Search Console: https://search.google.com/search-console
// Naver Search Advisor:  https://searchadvisor.naver.com
const GOOGLE_VERIFICATION = '';
const NAVER_VERIFICATION = '';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'CONX',
    template: '%s | CONX',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    '컨설팅 학회',
    '대학생 마케팅 학회',
    '대학생 협찬',
    '대학교 협찬',
    '학생회 협찬',
    '산학협력',
    '대외활동',
    '동아리 지원금',
    'MZ마케팅',
    'Z세대 마케팅',
  ],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: 'CONX',
    title: OG_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_URL,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: 'CONX | 기업과 대학생 크루를 연결하는 플랫폼',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: OG_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    ...(GOOGLE_VERIFICATION ? { google: GOOGLE_VERIFICATION } : {}),
    ...(NAVER_VERIFICATION ? { other: { 'naver-site-verification': NAVER_VERIFICATION } } : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${suit.variable} ${plusJakartaSans.variable} h-full antialiased`}>
      <body className="font-suit flex min-h-full flex-col">{children}</body>
    </html>
  );
}
