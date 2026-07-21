import Link from 'next/link';
import IconArrowRight from '@/assets/icons/icon_arrowRight_stroke.svg';
import StatusCard from '@/components/workspace/StatusCard';
import type { StatusCardData } from '@/types/workspace';

interface ProjectStatusSectionProps {
  statusCards: StatusCardData[];
  href?: string;
}

export default function ProjectStatusSection({ statusCards, href }: ProjectStatusSectionProps) {
  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-0.5">
        <h2 className="text-kor-heading-3-bold text-conx-common-black">프로젝트 현황</h2>
        {href ? (
          <Link
            href={href}
            className="hover:bg-conx-opacity-gray-6 flex items-center justify-center rounded-md p-1.5 active:bg-transparent"
          >
            <IconArrowRight className="size-4.5" />
          </Link>
        ) : (
          <button
            type="button"
            className="hover:bg-conx-opacity-gray-6 flex cursor-pointer items-center justify-center rounded-md p-1.5 active:bg-transparent"
          >
            <IconArrowRight className="size-4.5" />
          </button>
        )}
      </div>
      <div className="flex w-full justify-between">
        {statusCards.map((card) => (
          <StatusCard
            key={card.tagLabel}
            tagType={card.tagType}
            tagLabel={card.tagLabel}
            count={card.count}
          />
        ))}
      </div>
    </section>
  );
}
