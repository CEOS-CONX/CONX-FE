import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND_ENDPOINTS, COOKIE_CONFIG } from '@/constants/api';

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (accessToken) {
    await fetch(`${API_BASE_URL}${BACKEND_ENDPOINTS.AUTH.LOGOUT}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).catch(() => {});
  }

  const res = NextResponse.json({ success: true });

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
