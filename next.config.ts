import { apiPrefix } from "@/config/constants";
import type { NextConfig } from "next";

const apiURL = process.env.API_URL || "http://localhost:5000";
const CLOUDFRONT_HOSTNAME = "d2nwrdddg8skub.cloudfront.net";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  compiler: {
    styledComponents: true,
  },
  async redirects() {
    const eventPageDestination =
      "https://docs.google.com/forms/d/e/1FAIpQLSft1xi4NrQB_O6-OyOvVm_HcDSzQtog_3MMj2XAIVNaLKEJxA/viewform?usp=dialog";
    return [
      { source: "/event-page", destination: eventPageDestination, permanent: false },
      { source: "/event-page/", destination: eventPageDestination, permanent: false },
      { source: "/:lang/event-page", destination: eventPageDestination, permanent: false },
      { source: "/:lang/event-page/", destination: eventPageDestination, permanent: false },
    ];
  },
  async rewrites() {
    return [{ source: `/${apiPrefix}/:path*`, destination: `${apiURL}/:path*` }];
  },
  images: {
    domains: [CLOUDFRONT_HOSTNAME],
  },
  output: "standalone",
};

export default nextConfig;
