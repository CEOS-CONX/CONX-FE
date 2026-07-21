import { useState } from 'react';
import Image from 'next/image';
import { Tag } from '@/components/common/Tag';
import type { TagType } from '@/components/common/Tag';
import ScrapButton from './ScrapButton';

const FALLBACK_IMAGE = '/images/OG_image.png';

interface ImageCardProps {
  src: string;
  alt: string;
  tag?: { type: TagType; label: string };
  tags?: { type: TagType; label: string }[];
  defaultScraped?: boolean;
  onScrapChange?: (scraped: boolean) => void;
}

export default function ImageCard({
  src,
  alt,
  tag,
  tags,
  defaultScraped = false,
  onScrapChange,
}: ImageCardProps) {
  const tagList = tags ?? (tag ? [tag] : []);
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);

  return (
    <div className="group xlarge:h-36.5 large:h-30 relative h-50.75 w-full overflow-hidden rounded-md">
      {/* Image */}
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-120"
        onError={() => setImgSrc(FALLBACK_IMAGE)}
      />

      {/* Upper overlay */}
      <div
        className="z-conx-card-overlay absolute inset-x-0 top-0 flex items-center justify-between rounded-t-md pt-1.5 pr-1.5 pb-5.5 pl-2.5"
        style={{
          background:
            'linear-gradient(180deg, rgba(29, 34, 41, 0.16) 0%, rgba(29, 34, 41, 0) 100%)',
        }}
      >
        {tagList.length > 0 ? (
          <div className="flex items-center gap-2">
            {tagList.map((t, i) => (
              <Tag key={i} type={t.type} label={t.label} />
            ))}
          </div>
        ) : (
          <span />
        )}
        <ScrapButton defaultScraped={defaultScraped} onScrapChange={onScrapChange} />
      </div>
    </div>
  );
}
