interface ChartBarItemProps {
  value: string;
}

function ChartValue({ value }: { value: string }) {
  return (
    <span className="text-kor-label-1-semibold text-conx-common-black w-5.5 shrink-0">{value}</span>
  );
}

function ChartLine() {
  return <div className="bg-conx-gray-100 h-px min-w-0 flex-1 rounded-sm" />;
}

export default function ChartBarItem({ value }: ChartBarItemProps) {
  return (
    <div className="flex w-162.25 items-center gap-5.25">
      <ChartValue value={value} />
      <ChartLine />
    </div>
  );
}
