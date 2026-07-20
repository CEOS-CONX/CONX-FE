import Image from 'next/image';
import Tag from '@/components/common/Tag/Tag';
import { CTAButton } from '@/components/common/CTAButton';

interface CrewCardProps {
  profileSrc: string;
  name: string;
  subtitle: string;
  tags: string[];
  motivation: string;
  crewId?: string;
  onSelectClick?: () => void;
}

export default function CrewCard({
  profileSrc,
  name,
  subtitle,
  tags,
  motivation,
  crewId,
  onSelectClick,
}: CrewCardProps) {
  return (
    <div className="border-conx-gray-150 bg-conx-common-white flex w-85.25 flex-col gap-6 rounded-md border p-5">
      {/* 프로필 영역 */}
      <div className="flex items-start gap-4">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-md">
          <Image src={profileSrc} alt={name} fill className="object-cover" />
        </div>
        <div className="flex w-38.25 flex-col gap-2">
          <div className="flex flex-col">
            <span className="font-jakarta text-eng-heading-3-semibold text-conx-common-black">
              {name}
            </span>
            <span className="text-kor-label-1-semibold text-conx-gray-450">{subtitle}</span>
          </div>
          <div className="flex items-center gap-1">
            {tags.map((tag, i) => (
              <Tag key={`${tag}-${i}`} type="gray" label={tag} />
            ))}
          </div>
        </div>
      </div>

      {/* 지원 동기 */}
      <div className="bg-conx-gray-50 flex h-49.5 flex-col gap-2 overflow-y-auto rounded-md py-4 pr-2 pl-4">
        <span className="text-kor-body-1-semibold text-conx-common-black shrink-0">지원 동기</span>
        <p className="text-kor-label-1-medium text-conx-gray-600 whitespace-pre-wrap">
          {motivation}
        </p>
      </div>

      {/* 버튼 */}
      <div className="flex flex-col gap-2">
        <CTAButton variant="tertiary" href={crewId ? `/crews/${crewId}` : '#'}>
          크루 상세페이지
        </CTAButton>
        <CTAButton variant="secondary" onClick={onSelectClick}>
          크루 선택하기
        </CTAButton>
      </div>
    </div>
  );
}
