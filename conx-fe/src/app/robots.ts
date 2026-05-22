import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // TODO: 기획팀에서 비공개 페이지 목록 받으면 disallow 추가
      // disallow: ['/admin', '/mypage'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
