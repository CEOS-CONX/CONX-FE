interface ChoiceCardProps {
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function ChoiceCard({
  title,
  description,
  selected = false,
  onClick,
  className,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-conx-common-white flex h-59 w-54.5 cursor-pointer flex-col items-start justify-end gap-0.75 rounded-2xl pt-35.25 pr-8 pb-4 pl-5.75 ${selected ? 'outline-conx-primary-400 outline-4' : 'outline-conx-gray-150 hover:outline-conx-primary-300 outline-[1.2px] hover:outline-4'} outline ${className ?? ''}`}
    >
      <span className="text-kor-heading-1-bold text-conx-common-black">{title}</span>
      <span className="text-kor-body-2-medium text-conx-common-black text-left">{description}</span>
    </button>
  );
}
