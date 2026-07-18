import CrewProjectHistory from '@/components/crews/projects/CrewProjectHistory';

// Next 16: 동적 세그먼트 params는 Promise → await 해서 사용
export default async function CrewProjectsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CrewProjectHistory crewId={id} />;
}
