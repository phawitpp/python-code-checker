/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_URL: "http://127.0.0.1:5000",
    NEXT_PUBLIC_COMPILE_URL: "http://34.142.160.205:2358/",
  },
};

export default nextConfig;
