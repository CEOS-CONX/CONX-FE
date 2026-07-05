import { NextResponse } from 'next/server';
import { COOKIE_CONFIG } from '@/constants/api';

export async function POST() {
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
