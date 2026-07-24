import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; submissionId: string }> },
) {
  const { projectId, submissionId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }

  const backendRes = await fetch(
    `${API_BASE_URL}/api/v1/companies/me/projects/${projectId}/submissions/${submissionId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  const data = await backendRes.json().catch(() => ({
    message: '결과물 상세 조회에 실패했습니다.',
  }));

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data.message ?? '결과물 상세 조회에 실패했습니다.' },
      { status: backendRes.status },
    );
  }

  return NextResponse.json(data);
}
