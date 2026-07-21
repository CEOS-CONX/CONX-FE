import { memo } from 'react';
import IconStar from '@/assets/icons/icon_star_fill.svg';
import { ImageCard } from '@/components/common/ImageCard';
import type { TagType } from '@/components/common/Tag';

interface CardProps {
  imageSrc: string;
  imageAlt: string;
  tag?: { type: TagType; label: string };
  tags?: { type: TagType; label: string }[];
  defaultScraped?: boolean;
  onScrapChange?: (scraped: boolean) => void;
  title: string;
  subtitle?: string;
  category1?: string;
  category2?: string;
  startDate?: string;
  endDate?: string;
  rating?: number;
  totalCount?: number;
}

function Divider() {
  return (
    <div className="flex items-center p-0.5">
      <div className="bg-conx-gray-200 h-3 w-px rounded-full" />
    </div>
  );
}

export default memo(function Card({
  imageSrc,
  imageAlt,
  tag,
  tags,
  defaultScraped,
  onScrapChange,
  title,
  subtitle,
  category1,
  category2,
  startDate,
  endDate,
  rating,
  totalCount,
}: CardProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <ImageCard
        src={imageSrc}
        alt={imageAlt}
        tag={tag}
        tags={tags}
        defaultScraped={defaultScraped}
        onScrapChange={onScrapChange}
      />

      <div className="flex flex-col gap-0.5">
        <h3 className="text-kor-body-1-bold text-conx-common-black">{title}</h3>

        {subtitle && <p className="text-kor-label-1-semibold text-conx-gray-450">{subtitle}</p>}

        {category1 && category2 && (
          <div className="flex items-center gap-1">
            <span className="text-kor-label-1-semibold text-conx-gray-450">{category1}</span>
            <Divider />
            <span className="text-kor-label-1-semibold text-conx-gray-450">{category2}</span>
          </div>
        )}

        {startDate && endDate && (
          <div className="flex items-center gap-0.5">
            <span className="text-kor-label-1-semibold text-conx-gray-450">{startDate}</span>
            <span className="text-kor-label-1-semibold text-conx-gray-450">~</span>
            <span className="text-kor-label-1-semibold text-conx-gray-450">{endDate}</span>
          </div>
        )}

        {(rating !== undefined || totalCount !== undefined) && (
          <div className="flex items-center gap-1">
            {rating !== undefined && (
              <div className="flex items-start gap-1">
                <IconStar className="h-4.5 w-4.5" />
                <span className="text-kor-label-1-semibold text-conx-gray-450">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
            {rating !== undefined && totalCount !== undefined && <Divider />}
            {totalCount !== undefined && (
              <div className="flex items-center gap-1">
                <span className="text-kor-label-1-semibold text-conx-gray-450">누적</span>
                <span className="text-kor-label-1-semibold text-conx-gray-450">{totalCount}건</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
