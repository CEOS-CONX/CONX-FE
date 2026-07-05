interface MessageCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  sender: string;
  time: string;
  message: string;
  read?: boolean;
}

const BASE =
  'flex w-[425px] cursor-pointer flex-col items-start gap-2 px-5 pt-4.5 pb-5.5 text-left bg-conx-common-white hover:bg-conx-gray-50 active:bg-conx-gray-100';

export default function MessageCard({
  sender,
  time,
  message,
  read = false,
  className,
  ...props
}: MessageCardProps) {
  const senderClass = read ? 'text-conx-gray-300' : 'text-conx-gray-450';
  const messageClass = read ? 'text-conx-gray-450' : 'text-conx-common-black';
  const avatarClass = read ? 'bg-conx-gray-100' : 'bg-conx-gray-150';

  return (
    <button type="button" className={`${BASE} ${className ?? ''}`} {...props}>
      <div className="flex w-full items-center gap-2">
        {/* TODO: 실제 보낸 이 아바타 이미지로 교체 (현재 placeholder) */}
        <span className={`h-5 w-5 shrink-0 rounded-md ${avatarClass}`} aria-hidden />
        <span className={`text-kor-label-1-medium ${senderClass}`}>{sender}</span>
        <span className={`text-kor-caption-1-medium ${senderClass} ml-auto shrink-0`}>{time}</span>
      </div>
      <p className={`text-kor-body-1-medium ${messageClass}`}>{message}</p>
    </button>
  );
}
