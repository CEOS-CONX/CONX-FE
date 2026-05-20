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
    <div className="group relative h-[203px] min-h-[120px] w-[337px] min-w-[200px] overflow-hidden rounded-[6px]">
      {/* Image */}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-120"
      />

      {/* Upper overlay */}
      <div
        className="absolute inset-x-0 top-0 z-10 flex items-center justify-between rounded-t-[6px] pt-[6px] pr-[6px] pb-[22px] pl-[10px]"
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
