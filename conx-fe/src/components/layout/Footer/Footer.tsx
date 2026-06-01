import Link from 'next/link';
import IconInstagram from '@/assets/icons/icon_instagram.svg';
import LogoConxFooter from '@/assets/icons/logo_conx_footer.svg';

function Divider() {
  return (
    <div className="flex h-4.5 w-px items-center">
      <div className="h-[10.8px] w-px bg-[rgba(112,115,124,0.22)]" />
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-conx-gray-50 w-full">
      <div className="mx-auto max-w-400 min-w-248 px-16.5">
        <div className="px-6 pt-5 pb-14">
          <div className="flex items-start justify-between">
            <LogoConxFooter className="h-6.5 w-30" />

            {/* Instagram */}
            <a
              aria-label="인스타그램"
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center"
            >
              <IconInstagram className="h-9 w-9" />
            </a>
          </div>

          {/* Description */}
          <div className="mt-7">
            {/* Company info */}
            <div className="flex flex-col gap-1">
              {/* Row 1: CONX | 대표 조아현 */}
              <div className="flex flex-wrap content-start items-start gap-2">
                <span className="text-kor-label-1-bold text-conx-gray-500">CONX</span>
                <Divider />
                <span className="text-kor-label-1-bold text-conx-gray-500">대표</span>
                <span className="text-kor-label-1-medium text-conx-gray-400">조아현</span>
              </div>

              {/* Row 2: 문의 | 호스팅 */}
              <div className="flex flex-wrap content-start items-start gap-2">
                <span className="text-kor-label-1-bold text-conx-gray-500">
                  프로젝트 제휴 및 서비스 문의
                </span>
                <span className="font-jakarta text-eng-label-1-medium text-conx-gray-400">
                  contact@conx.co.kr
                </span>
                <Divider />
                <span className="text-kor-label-1-bold text-conx-gray-500">호스팅 사업자</span>
                <span className="font-jakarta text-eng-label-1-medium text-conx-gray-400">
                  Amazon AWS Service(AWS)
                </span>
              </div>

              {/* Disclaimer lines */}
              <div className="flex flex-col gap-1">
                <p className="text-kor-label-1-medium text-conx-gray-400">
                  커넥스는 통신판매중개자로서 프로젝트 계약의 당사자가 아니며, 프로젝트 내용, 수행
                  결과, 거래 조건 등에 대한 책임은 각 참여 회원에게 있습니다.
                </p>
                <p className="text-kor-label-1-medium text-conx-gray-400">
                  커넥스 사이트 내 프로젝트, 크루 프로필, 결과물, 이미지 및 콘텐츠의 무단 복제,
                  배포, 전송, 스크래핑 등의 행위는 관련 법령에 따라 금지됩니다.
                </p>
                <p className="text-kor-label-1-medium text-conx-gray-400">
                  커넥스는 안전한 프로젝트 협업 환경을 위해 회원 정보와 거래 데이터를 관련 법령에
                  따라 보호하고 있습니다.
                </p>
              </div>
            </div>

            {/* Copyright */}
            <p className="font-jakarta text-eng-label-1-medium text-conx-gray-400 mt-7">
              Copyright © 2026 CONX Inc. All rights reserved.
            </p>
          </div>

          {/* Menu */}
          <div className="mt-2 flex gap-8">
            <Link href="#" className="text-kor-label-1-bold text-conx-gray-450 py-2">
              이용약관
            </Link>
            <Link href="#" className="text-kor-label-1-bold text-conx-gray-450 py-2">
              개인정보 처리방침
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
