import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_ENDPOINTS, COOKIE_CONFIG } from '@/constants/api';

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendRes = await fetch(`${API_BASE_URL}${BACKEND_ENDPOINTS.AUTH.LOGIN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!backendRes.ok) {
    const error = await backendRes.json().catch(() => ({ message: '로그인에 실패했습니다.' }));
    return NextResponse.json(
      { message: error.message ?? '로그인에 실패했습니다.' },
      { status: backendRes.status },
    );
  }

  const accessToken = backendRes.headers.get('Authorization')?.replace('Bearer ', '');
  const backendSetCookies = backendRes.headers.getSetCookie();

  const data = await backendRes.json().catch(() => ({}));
  const user = data.data;

  const res = NextResponse.json({ user });

  res.cookies.set(COOKIE_CONFIG.USER.name, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: COOKIE_CONFIG.USER.path,
    maxAge: 60 * 60 * 24 * 3,
  });

  if (accessToken) {
    res.cookies.set(COOKIE_CONFIG.ACCESS_TOKEN.name, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: COOKIE_CONFIG.ACCESS_TOKEN.path,
      maxAge: 60 * 60,
    });
  }

  for (const cookie of backendSetCookies) {
    res.headers.append('Set-Cookie', cookie);
  }

  return res;
}
