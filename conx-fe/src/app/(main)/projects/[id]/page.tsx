import ProjectDetailBody from '@/components/projects/detail/ProjectDetailBody';

// Next 16: 동적 세그먼트 params는 Promise → await 해서 사용
export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectDetailBody projectId={id} />;
}
