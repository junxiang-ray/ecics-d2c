// next.config.js
const nextConfig = {
  reactStrictMode: false, // ⭐ Added here

  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
          },
        },
      ],
    });

    return config;
  },
  redirects: () => {
    return [
      {
        source: '/portal',
        destination: '/portal/home',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
