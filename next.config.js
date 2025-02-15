/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "developers.moralis.com",
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      "www.larvalabs.com",
      "drive.google.com",
    ],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            svgoConfig: {
              plugins: [
                {
                  name: "removeViewBox",
                  active: false,
                },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
