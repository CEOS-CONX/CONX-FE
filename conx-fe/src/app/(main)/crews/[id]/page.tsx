import CrewDetailBody from '@/components/crews/detail/CrewDetailBody';

// Next 16: 동적 세그먼트 params는 Promise → await 해서 사용
export default async function CrewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CrewDetailBody crewId={id} />;
}
