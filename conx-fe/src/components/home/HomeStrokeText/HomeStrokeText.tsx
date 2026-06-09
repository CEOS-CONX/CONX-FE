type HomeStrokeTextProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function HomeStrokeText({ children, className, ...props }: HomeStrokeTextProps) {
  return (
    <button
      type="button"
      className={`text-kor-body-1-medium text-conx-gray-500 border-conx-gray-500 hover:border-conx-common-black hover:text-conx-common-black inline-flex cursor-pointer items-center justify-center rounded-full border px-5 py-3 disabled:pointer-events-none disabled:opacity-50 ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
