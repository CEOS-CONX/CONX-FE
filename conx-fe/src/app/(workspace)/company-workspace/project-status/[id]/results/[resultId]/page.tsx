import CompanyResultDetail from '@/components/company-workspace/CompanyResultDetail';

export default async function CompanyResultDetailPage({
  params,
}: {
  params: Promise<{ id: string; resultId: string }>;
}) {
  const { id, resultId } = await params;
  return <CompanyResultDetail projectId={id} resultId={resultId} />;
}
