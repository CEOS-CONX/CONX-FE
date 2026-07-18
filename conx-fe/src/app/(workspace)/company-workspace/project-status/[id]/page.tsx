import CompanyProjectDetail from '@/components/company-workspace/CompanyProjectDetail';

export default async function CompanyProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CompanyProjectDetail projectId={id} />;
}
