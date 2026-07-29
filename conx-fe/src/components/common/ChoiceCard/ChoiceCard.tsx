import Image, { type StaticImageData } from 'next/image';

interface ChoiceCardProps {
  title: string;
  description: string;
  imageSrc?: StaticImageData;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function ChoiceCard({
  title,
  description,
  imageSrc,
  selected = false,
  onClick,
  className,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-conx-common-white flex h-63 w-54.5 cursor-pointer flex-col items-start justify-end gap-1 rounded-2xl px-5.75 pb-4 ${selected ? 'outline-conx-primary-400 outline-4' : 'outline-conx-gray-150 hover:outline-conx-primary-300 outline-[1.2px] hover:outline-4'} outline ${className ?? ''}`}
    >
      {imageSrc && <Image src={imageSrc} width={170} height={148} alt="" className="self-center" />}
      <div className="flex flex-col gap-0.5">
        <span className="text-kor-heading-1-bold text-conx-common-black text-left">{title}</span>
        <span className="text-kor-body-2-medium text-conx-common-black text-left">
          {description}
        </span>
      </div>
    </button>
  );
}
