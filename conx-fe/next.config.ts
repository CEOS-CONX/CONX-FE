import type { NextConfig } from 'next';

// SVGR가 SVGO 기본값으로 viewBox를 제거하면 아이콘이 스케일되지 않고 잘림.
// removeViewBox: false 로 viewBox를 유지해 크기 조절이 정상 동작하게 함.
const svgrOptions = {
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
      // 프로덕션 빌드에서 cleanupIds가 그라디언트 id를 'a' 등으로 축약하는데,
      // 같은 페이지에 인라인된 여러 SVG(예: navbar 로고 + 게이트 로고)가 모두 #a가 되면
      // 뒤 SVG의 fill="url(#a)"가 앞 SVG의 그라디언트를 가리켜 엉뚱한 색으로 렌더됨.
      // prefixIds로 파일명 기반 접두어를 붙여 id를 파일마다 고유하게 만들어 충돌 방지.
      'prefixIds',
    ],
  },
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'picsum.photos' },
      { hostname: 'placehold.co' },
      ...(process.env.S3_HOSTNAME ? [{ hostname: process.env.S3_HOSTNAME }] : []),
    ],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: svgrOptions,
          },
        ],
        as: '*.js',
      },
    },
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (rule: { test?: { test?: (s: string) => boolean } }) => rule.test?.test?.('.svg'),
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: svgrOptions,
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
