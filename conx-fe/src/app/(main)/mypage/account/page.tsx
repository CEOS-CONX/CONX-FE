import AccountView from '@/components/mypage/AccountView';

export default function AccountPage() {
  // 피그마: 내 정보는 사이드바 오른쪽이 아니라 '페이지(컨테이너) 전체' 기준 가운데 정렬.
  // 콘텐츠는 flex-1(사이드바 200 + gap 40 = 240px 오른쪽) 안에 있으므로,
  // ml = 50%(flex-1 폭) − (오프셋 240 + 내용폭 400)/2 = 50% − 320px 로 컨테이너 중앙에 맞춘다.
  // (transform이 아닌 margin이라 AccountView 내부 fixed 모달에 영향 없음)
  return (
    <div className="ml-[calc(50%-320px)]">
      <AccountView />
    </div>
  );
}
