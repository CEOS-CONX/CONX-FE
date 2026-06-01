type TextLineButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function TextLineButton({ children, className, ...props }: TextLineButtonProps) {
  return (
    <button
      type="button"
      className={`text-kor-label-1-medium text-conx-gray-450 hover:text-conx-gray-550 active:text-conx-gray-600 cursor-pointer underline disabled:cursor-not-allowed ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
