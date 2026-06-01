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
    ],
  },
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: 'picsum.photos' }, { hostname: 'placehold.co' }],
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
