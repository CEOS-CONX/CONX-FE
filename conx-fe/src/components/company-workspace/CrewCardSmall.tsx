import Image from 'next/image';

interface CrewCardSmallProps {
  profileSrc: string;
  name: string;
  subtitle: string;
}

export default function CrewCardSmall({ profileSrc, name, subtitle }: CrewCardSmallProps) {
  return (
    <div className="flex items-start gap-4 px-4 py-2">
      <div className="relative size-12 shrink-0 overflow-hidden rounded-md">
        <Image src={profileSrc} alt={name} fill className="object-cover" />
      </div>
      <div className="flex w-38.25 flex-col">
        <span className="font-jakarta text-eng-heading-3-semibold text-conx-common-black">
          {name}
        </span>
        <span className="text-kor-label-1-semibold text-conx-gray-450">{subtitle}</span>
      </div>
    </div>
  );
}
