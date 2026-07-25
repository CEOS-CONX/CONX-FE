import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_ENDPOINTS } from '@/constants/api';

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendRes = await fetch(`${API_BASE_URL}${BACKEND_ENDPOINTS.AUTH.PASSWORD_RESET_SEND}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json().catch(() => ({}));

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data.message ?? '이메일을 다시 확인해 주세요.' },
      { status: backendRes.status },
    );
  }

  return NextResponse.json({ message: data.message ?? '성공' });
}
