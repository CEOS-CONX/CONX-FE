import Link from 'next/link';
import IconArrowRight from '@/assets/icons/icon_arrowRight_stroke.svg';

interface CumulativeFundingSectionProps {
  amount: string;
  message: string;
}

export default function CumulativeFundingSection({
  amount,
  message,
}: CumulativeFundingSectionProps) {
  return (
    <section className="flex min-w-0 flex-1 flex-col items-end gap-3.5">
      <div className="flex w-full items-end justify-between">
        <div className="flex items-center gap-0.5">
          <h2 className="text-kor-heading-3-bold text-conx-common-black">누적 지원금</h2>
          <Link
            href="/crew-workspace/settlement"
            className="hover:bg-conx-opacity-gray-6 flex items-center justify-center rounded-md p-1.5 active:bg-transparent"
          >
            <IconArrowRight className="size-4.5" />
          </Link>
        </div>
        <span className="text-kor-label-1-medium text-conx-gray-450">인센티브 제외 기준</span>
      </div>
      <div className="border-conx-gray-150 flex h-78.5 w-full flex-col items-end justify-between rounded-md border p-6">
        <div className="text-conx-common-black flex w-full flex-col">
          <span className="text-kor-body-1-semibold">{message}</span>
          <div className="flex items-end gap-1.25">
            <span className="font-jakarta text-eng-display-3-bold tracking-[-0.02em]">
              {amount}
            </span>
            <span className="text-kor-title-3-semibold">원</span>
          </div>
        </div>
        <div className="bg-conx-gray-100 size-39.75" />
      </div>
    </section>
  );
}
