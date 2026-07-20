import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND_ENDPOINTS, COOKIE_CONFIG } from '@/constants/api';

const API_BASE_URL = process.env.API_BASE_URL;

export async function DELETE() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }

  const backendRes = await fetch(`${API_BASE_URL}${BACKEND_ENDPOINTS.AUTH.DELETE_ACCOUNT}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await backendRes.json().catch(() => ({
    message: '회원 탈퇴에 실패했습니다.',
  }));

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data.message ?? '회원 탈퇴에 실패했습니다.' },
      { status: backendRes.status },
    );
  }

  const res = NextResponse.json(data);

  const cookieDefaults = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
  };

  res.cookies.set(COOKIE_CONFIG.ACCESS_TOKEN.name, '', {
    ...cookieDefaults,
    path: COOKIE_CONFIG.ACCESS_TOKEN.path,
  });
  res.cookies.set(COOKIE_CONFIG.USER.name, '', {
    ...cookieDefaults,
    path: COOKIE_CONFIG.USER.path,
  });
  res.cookies.set(COOKIE_CONFIG.REFRESH_TOKEN.name, '', {
    ...cookieDefaults,
    path: COOKIE_CONFIG.REFRESH_TOKEN.path,
  });

  return res;
}
