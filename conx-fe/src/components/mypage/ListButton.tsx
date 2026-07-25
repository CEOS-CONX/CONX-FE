import IconArrowRight from '@/assets/icons/icon_arrowRight_stroke.svg';

interface ListButtonProps {
  label: string;
  text?: string;
  onClick?: () => void;
}

export default function ListButton({ label, text, onClick }: ListButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-conx-common-white border-conx-gray-100 hover:bg-conx-opacity-gray-6 hover:border-conx-gray-150 active:bg-conx-opacity-gray-30 active:border-conx-gray-350 flex w-full items-center justify-between gap-4 border-b px-3 text-left transition-colors ${
        text ? 'py-[18px]' : 'py-[22px]'
      }`}
    >
      <span className="flex min-w-0 flex-col gap-2">
        <span className="text-kor-body-1-medium text-conx-gray-500">{label}</span>
        {text && (
          <span className="text-kor-body-1-semibold text-conx-common-black truncate">{text}</span>
        )}
      </span>
      <IconArrowRight className="[&_path]:stroke-conx-gray-300 h-4.5 w-4.5 shrink-0" />
    </button>
  );
}
