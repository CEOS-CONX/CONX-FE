import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND_ENDPOINTS } from '@/constants/api';

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const { searchParams } = request.nextUrl;
  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}${BACKEND_ENDPOINTS.CREW.LIST}${queryString ? `?${queryString}` : ''}`;

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const backendRes = await fetch(url, { headers });

  const data = await backendRes.json().catch(() => ({
    message: '크루 목록 조회에 실패했습니다.',
  }));

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data.message ?? '크루 목록 조회에 실패했습니다.' },
      { status: backendRes.status },
    );
  }

  return NextResponse.json(data);
}
