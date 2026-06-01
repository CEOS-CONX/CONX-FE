import Image from 'next/image';
import { Tag } from '@/components/common/Tag';
import type { TagType } from '@/components/common/Tag';
import ScrapButton from './ScrapButton';

interface ImageCardProps {
  src: string;
  alt: string;
  tag?: { type: TagType; label: string };
  defaultScraped?: boolean;
}

export default function ImageCard({ src, alt, tag, defaultScraped = false }: ImageCardProps) {
  return (
    <div className="group relative h-30 w-full overflow-hidden rounded-md min-[1200px]:h-36.5 min-[1600px]:h-50.75">
      {/* Image */}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-120"
      />

      {/* Upper overlay */}
      <div
        className="z-conx-card-overlay absolute inset-x-0 top-0 flex items-center justify-between rounded-t-md pt-1.5 pr-1.5 pb-5.5 pl-2.5"
        style={{
          background:
            'linear-gradient(180deg, rgba(29, 34, 41, 0.16) 0%, rgba(29, 34, 41, 0) 100%)',
        }}
      >
        {tag ? <Tag type={tag.type} label={tag.label} /> : <span />}
        <ScrapButton defaultScraped={defaultScraped} />
      </div>
    </div>
  );
}
