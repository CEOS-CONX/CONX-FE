import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL;

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ settlementId: string }> },
) {
  const { settlementId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }

  const backendRes = await fetch(
    `${API_BASE_URL}/api/v1/crews/settlements/${settlementId}/complete`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await backendRes.json().catch(() => ({
    message: '지급 확인 상태 변경에 실패했습니다.',
  }));

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data.message ?? '지급 확인 상태 변경에 실패했습니다.' },
      { status: backendRes.status },
    );
  }

  return NextResponse.json(data);
}
