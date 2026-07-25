// 개발용 미리보기 오버라이드 (fallback)
// 로그인이 안 되는 로컬(백엔드/API_BASE_URL 없음)에서 기업/크루 뷰를 강제로 확인하기 위한 스위치.
//
// 보통은 URL 로 토글하세요 →  /mypage?as=company  |  /mypage?as=crew
//   (URL 파라미터가 이 상수보다 우선. 파라미터가 없을 때만 이 값을 사용)
//
// 이 상수는 파라미터 없이 기본 뷰를 고정하고 싶을 때만 사용. null 이면 실제 로그인 userType.
// ⚠️ 배포/PR 전 반드시 null 로 둘 것.
export const DEV_PREVIEW_ROLE: 'company' | 'crew' | null = null;
