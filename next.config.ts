import { apiPrefix, cloudfrontURL } from "@/config/constants";
import type { NextConfig } from "next";

const apiURL = process.env.API_URL || "http://localhost:5000";

function assetHostname(): string {
  const configured = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
  // Set-but-empty would leave app code emitting root-relative image paths
  // while this allowlist silently kept the default host.
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
  // Old website URLs (fe#1056), still in emails, flyers and QR codes since
  // need4deed.org moved to fe. Redirects run before the middleware, and Next
  // keeps the query string (e.g. ?id=&title= from old opportunity cards).
  // The old site put the language last (/volunteer-form/de); a missing or
  // unknown language goes to the bare path and the middleware picks one.
  async redirects() {
    const legacyForms = [
      { from: "volunteer-form", to: "forms/volunteer" },
      // The old NGO form is retired: send NGOs to sign-up instead.
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
    // The /_next/image optimizer returns 500 in production (fe#1087), which
    // broke every next/image (e.g. the Become-a-volunteer logo). Assets are
    // already optimized webp on the CDN, so load them directly.
    unoptimized: true,
  },
  output: "standalone",
};

export default nextConfig;
