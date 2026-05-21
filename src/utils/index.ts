export * from "./helpers";

import { cloudfrontURL } from "@/config/constants";
import { DocumentStatusType } from "need4deed-sdk";

export function utcHhmmToLocal(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return hhmm;
  const d = new Date();
  d.setUTCHours(h, m, 0, 0);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function localHhmmToUtc(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return hhmm;
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}


export function getDateLocalTooUTC(dateStr: string | undefined) {
  if (!dateStr) return undefined;

  return new Date(dateStr).toISOString();
}

export function haveCommonElements(...arrays: Array<Array<unknown>>) {
  const combined = new Set(arrays.flat()); // Flatten and put all in a Set
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  return combined.size < totalLength;
}

export function parseYesNo(value: boolean | undefined): DocumentStatusType {
  if (value) return DocumentStatusType.YES;
  return DocumentStatusType.NO;
}

export function* range(start: number, end: number, step = 1) {
  if (typeof start !== "number" || typeof end !== "number" || typeof step !== "number") {
    throw new TypeError("Start, end, and step must be numbers.");
  }

  if (step === 0 || !Number.isInteger(step)) {
    throw new RangeError("Step has to be non zero integer.");
  }

  function isWithinRange(value: number) {
    if (step > 0) return value < end;
    return value > end;
  }

  for (let i = start; isWithinRange(i); i += step) {
    yield i;
  }
}

export function fetchFn<R, D = R>({
  url,
  options,
  fnDTO,
}: {
  url: string;
  options?: RequestInit;
  fnDTO?: (data: R) => D;
}): Promise<D> {
  const defaultOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
  };

  return fetch(url, { ...defaultOptions, ...options })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(`${url}: ${response.statusText}`);
    })
    .then((data) => {
      return fnDTO ? fnDTO(data) : data;
    });
}

export const getImageUrl = (imageName: string): string => {
  return `${cloudfrontURL}/${imageName}`;
};

export function formatDateTime(input: string | Date | undefined): string | undefined {
  if (!input) return undefined;

  let date: Date;

  if (typeof input === "string") {
    const parsedDate = new Date(input);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date string provided.");
    }
    date = parsedDate;
  } else if (input instanceof Date) {
    date = input;
  } else {
    throw new TypeError("Input must be a string or Date.");
  }

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return date.toLocaleString("en-US", options);
}

/**
 * Wraps an asynchronous Promise and converts its outcome into a Result<T, E> type.
 * A successful Promise resolves to [value, null].
 * A rejected Promise is caught and resolves to [null, error].
 *
 * @param promise The Promise to execute.
 * @returns A Promise that resolves to a Result tuple.
 */
type Success<T> = readonly [T, null];
type Failure<E = Error> = readonly [null, E];
type Result<T, E = Error> = Success<T> | Failure<E>;
export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const result = await promise;
    return [result, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}
