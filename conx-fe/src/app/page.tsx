import { SearchBar } from '@/components/common/SearchBar';

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <h1 className="text-2xl font-semibold">CONX</h1>
      <SearchBar />
    </div>
  );
}
