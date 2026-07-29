import IconMobileRestricted from '@/assets/icons/icon_mobileRestricted.svg';

export default function MobileGate() {
  return (
    <section className="bg-conx-gray-50 flex min-h-dvh w-full flex-col items-center gap-4 pt-33">
      <IconMobileRestricted className="size-40" />
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-kor-heading-1-bold text-conx-gray-550">PC 환경에서 이용해주세요.</h1>
        <p className="text-kor-body-1-medium text-conx-gray-450">
          CONX는 현재 데스크톱과 노트북 환경에
          <br />
          최적화되어 있어요.
        </p>
      </div>
    </section>
  );
}
