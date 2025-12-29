/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Wildcard to allow all domains
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    // Cache images for 1 day (86400 seconds = 24 hours)
    minimumCacheTTL: 86400,
    // Enable image optimization caching
    // dangerouslyAllowSVG: false,
    // contentDispositionType: "attachment",
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Add webpack configuration for better Safari compatibility (production builds)
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     // Ensure proper module resolution for Safari
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //       net: false,
  //       tls: false,
  //     };
  //   }
  //   return config;
  // },
  // Optimize chunk loading for Safari
  // productionBrowserSourceMaps: false,
};

export default nextConfig;
