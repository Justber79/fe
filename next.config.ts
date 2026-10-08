import { apiPrefix, cloudfrontURL } from "@/config/constants";
import type { NextConfig } from "next";

const apiURL = process.env.API_URL || "http://localhost:5000";

function assetHostname(): string {
  const configured = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
  if (configured !== undefined && configured.trim() === "") {
    throw new Error("NEXT_PUBLIC_CLOUDFRONT_URL is set but empty");
  }
  const url = cloudfrontURL;
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
  async redirects() {
    const legacyForms = [
      { from: "volunteer-form", to: "forms/volunteer" },
      { from: "opportunity-form", to: "register/agent" },
    ];
    const formRedirects = legacyForms.flatMap(({ from, to }) => [
      { source: `/${from}/:lng(de|en)`, destination: `/:lng/${to}`, permanent: true },
      { source: `/:lng(de|en)/${from}`, destination: `/:lng/${to}`, permanent: true },
      { source: `/${from}/:rest*`, destination: `/${to}`, permanent: true },
    ]);
    const pages = [
      "about",
      "faq",
      "agreement",
      "legal-notice",
      "data-privacy",
      "rac-guidelines",
      "announcement",
      "event-page",
    ];
    const pageRedirects = pages.map((page) => ({
      source: `/${page}/:lng(de|en)`,
      destination: `/:lng/${page}`,
      permanent: true,
    }));
    const vpaRedirects = [
      { source: "/vpa/:lng(de|en)", destination: "/:lng/agreement", permanent: true },
      { source: "/:lng(de|en)/vpa", destination: "/:lng/agreement", permanent: true },
      { source: "/vpa", destination: "/agreement", permanent: true },
    ];

    return [...formRedirects, ...pageRedirects, ...vpaRedirects];
  },
  async rewrites() {
    return [{ source: `/${apiPrefix}/:path*`, destination: `${apiURL}/:path*` }];
  },
  images: {
    domains: [assetHostname()],
    unoptimized: true,
  },
  output: "standalone",
};

export default nextConfig;
