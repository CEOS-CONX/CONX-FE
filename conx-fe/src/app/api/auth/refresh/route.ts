import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND_ENDPOINTS, COOKIE_CONFIG } from '@/constants/api';

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: '리프레시 토큰이 없습니다.' }, { status: 401 });
  }

  const backendRes = await fetch(`${API_BASE_URL}${BACKEND_ENDPOINTS.AUTH.REFRESH}`, {
    method: 'POST',
    headers: { Cookie: `refreshToken=${refreshToken}` },
  });

  if (!backendRes.ok) {
    const error = await backendRes.json().catch(() => ({ message: '토큰 재발급에 실패했습니다.' }));
    return NextResponse.json(
      { message: error.message ?? '토큰 재발급에 실패했습니다.' },
      { status: backendRes.status },
    );
  }

  const newAccessToken = backendRes.headers.get('Authorization')?.replace('Bearer ', '');
  const backendSetCookies = backendRes.headers.getSetCookie();
  const data = await backendRes.json().catch(() => ({}));

  const res = NextResponse.json({ message: data.message ?? '성공' });

  if (newAccessToken) {
    res.cookies.set(COOKIE_CONFIG.ACCESS_TOKEN.name, newAccessToken, {
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
