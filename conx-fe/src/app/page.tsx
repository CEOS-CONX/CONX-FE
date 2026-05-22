'use client';
import { SearchBar } from '@/components/common/SearchBar';
import { Dropdown } from '@/components/common/Dropdown';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';

const options = [
  { value: 'club', label: '동아리' },
  { value: 'union', label: '학생회' },
  { value: 'lab', label: '학회' },
];

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <h1 className="text-2xl font-semibold">CONX</h1>
      <SearchBar />
      <Dropdown options={options} placeholder="유형 선택" onChange={(v) => console.log(v)} />
      <DropdownCalendar
        onChange={(range) => {
          console.log(range.start, range.end);
        }}
      />
    </div>
  );
}
