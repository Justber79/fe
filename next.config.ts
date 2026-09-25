import { apiPrefix } from "@/config/constants";
import type { NextConfig } from "next";

const apiURL = process.env.API_URL || "http://localhost:5000";
// Keep in sync with the Dockerfile's NEXT_PUBLIC_CLOUDFRONT_URL default.
const DEFAULT_ASSET_URL = "https://d2nwrdddg8skub.cloudfront.net/images";

function assetHostname(): string {
  const configured = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
  // Set-but-empty would leave app code emitting root-relative image paths
  // while this allowlist silently kept the default host.
  if (configured !== undefined && configured.trim() === "") {
    throw new Error("NEXT_PUBLIC_CLOUDFRONT_URL is set but empty");
  }
  const url = configured || DEFAULT_ASSET_URL;
  try {
    return new URL(url).hostname;
  } catch {
    throw new Error(`NEXT_PUBLIC_CLOUDFRONT_URL is not a valid URL: "${url}"`);
  }
}

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  compiler: {
    styledComponents: true,
  },
  async rewrites() {
    return [{ source: `/${apiPrefix}/:path*`, destination: `${apiURL}/:path*` }];
  },
  images: {
    domains: [assetHostname()],
  },
  output: "standalone",
};

export default nextConfig;
