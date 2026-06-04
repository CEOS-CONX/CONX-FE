type HomeCircleSize = 'sm' | 'lg';

interface HomeCircleProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'title'
> {
  size?: HomeCircleSize;
  keyword: string;
  title: [string, string]; // 2줄 고정
  description: [string, string, string]; // 3줄 고정
}

const SIZE_STYLES: Record<HomeCircleSize, { box: string; title: string; description: string }> = {
  lg: {
    box: 'h-[368px] w-[368px]',
    title: 'text-kor-heading-1-bold',
    description: 'text-kor-heading-3-semibold',
  },
  sm: {
    box: 'h-[267px] w-[267px]',
    title: 'text-kor-heading-3-bold',
    description: 'text-kor-label-1-semibold',
  },
};

export default function HomeCircle({
  size = 'lg',
  keyword,
  title,
  description,
  className,
  ...props
}: HomeCircleProps) {
  const s = SIZE_STYLES[size];

  return (
    <button
      type="button"
      className={`bg-conx-gray-50 hover:bg-conx-primary-100 flex shrink-0 cursor-pointer flex-col items-center justify-center rounded-full ${s.box} ${s.gap} ${className ?? ''}`}
      {...props}
    >
      {/* 키워드 pill */}
      <span className="text-eng-label-1-bold bg-conx-primary-450 text-conx-common-white mb-6 rounded-full px-3 py-1">
        {keyword}
      </span>

      {/* 타이틀 (2줄) */}
      <div className={`text-conx-common-black mb-3 text-center ${s.title}`}>
        {title.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {/* 설명 (3줄) */}
      <div className={`text-conx-gray-550 text-center ${s.description}`}>
        {description.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </button>
  );
}
