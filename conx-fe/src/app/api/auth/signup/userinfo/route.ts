import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_ENDPOINTS } from '@/constants/api';
import { USER_TYPE } from '@/types/auth';

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userType, ...payload } = body;

  const endpoint =
    userType === USER_TYPE.COMPANY
      ? BACKEND_ENDPOINTS.AUTH.SIGNUP_USERINFO_COMPANY
      : BACKEND_ENDPOINTS.AUTH.SIGNUP_USERINFO_CREW;

  const backendRes = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await backendRes.json().catch(() => ({}));

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data.message ?? '회원가입에 실패했습니다.' },
      { status: backendRes.status },
    );
  }

  return NextResponse.json({ message: data.message ?? '성공', data: data.data });
}
