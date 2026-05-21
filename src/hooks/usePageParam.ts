import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Persists the current page number in the URL as `?page=X`.
 * Reading the URL means navigating back restores the previous page.
 */
export function usePageParam() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page") ?? "1");

  const setCurrentPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      if (page <= 1) params.delete("page");
      else params.set("page", String(page));
      const qs = params.toString();
      router.push(pathname + (qs ? "?" + qs : ""));
    },
    [searchParams, pathname, router],
  );

  return { currentPage, setCurrentPage };
}
