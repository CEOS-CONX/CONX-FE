type TextLineButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function TextLineButton({ children, className, ...props }: TextLineButtonProps) {
  return (
    <button
      type="button"
      className={`text-kor-body-1-medium text-conx-gray-450 hover:text-conx-gray-650 active:text-conx-common-black disabled:text-conx-gray-300 cursor-pointer underline disabled:cursor-not-allowed ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
