import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_ENDPOINTS } from '@/constants/api';

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendRes = await fetch(`${API_BASE_URL}${BACKEND_ENDPOINTS.AUTH.SIGNUP_SETTING_CREW}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json().catch(() => ({}));

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data.message ?? '크루 정보 등록에 실패했습니다.' },
      { status: backendRes.status },
    );
  }

  return NextResponse.json({ message: data.message ?? '크루 회원가입 성공', data: data.data });
}
