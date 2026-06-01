import IconSearchStroke from '@/assets/icons/icon_search_stroke.svg';
import IconSearchFill from '@/assets/icons/icon_search_fill.svg';

type SearchBarProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function SearchBar({ className, placeholder = '검색창', ...props }: SearchBarProps) {
  return (
    <label
      className={`group bg-conx-common-white border-conx-gray-300 has-[input:not(:placeholder-shown):not(:focus)]:border-conx-gray-500 focus-within:border-conx-primary-300 flex h-11 max-w-114.25 min-w-50 cursor-text items-center gap-3 rounded-md border px-4 ${className ?? ''}`}
    >
      <IconSearchStroke className="block h-6 w-6 shrink-0 group-focus-within:hidden group-has-[input:not(:placeholder-shown)]:hidden" />
      <IconSearchFill className="hidden h-6 w-6 shrink-0 group-focus-within:block group-has-[input:not(:placeholder-shown)]:block" />
      <input
        type="text"
        placeholder={placeholder}
        className="text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-450 min-w-0 flex-1 truncate bg-transparent outline-none"
        {...props}
      />
    </label>
  );
}
