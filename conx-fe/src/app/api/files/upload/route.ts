import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND_ENDPOINTS } from '@/constants/api';

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }

  const body = await request.json();

  const backendRes = await fetch(`${API_BASE_URL}${BACKEND_ENDPOINTS.FILE.UPLOAD}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json().catch(() => ({
    message: 'Presigned URL 발급에 실패했습니다.',
  }));

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data.message ?? 'Presigned URL 발급에 실패했습니다.' },
      { status: backendRes.status },
    );
  }

  return NextResponse.json(data);
}
