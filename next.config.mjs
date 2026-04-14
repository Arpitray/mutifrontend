/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*'
      }
    ]
  },
  // Allow larger request/response bodies
  httpAgentOptions: {
    keepAlive: false,
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  }
};

export default nextConfig;
