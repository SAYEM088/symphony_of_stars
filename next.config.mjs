/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['stsci-opo.org'], // Add the hostname here
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.csv$/,          // Apply this rule to CSV files
      loader: 'csv-loader',    // Use the csv-loader package
      options: {
        dynamicTyping: true,   // Automatically convert numeric values
        header: true,          // Treat the first row as the header
        skipEmptyLines: true,  // Skip any empty lines
      },
    });
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)', // Apply headers to all routes
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
