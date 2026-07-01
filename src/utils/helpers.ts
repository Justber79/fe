import {
  AUTH_HINT_COOKIE_ATTRS,
  AUTH_HINT_COOKIE_NAME,
  AUTH_HINT_MAX_AGE,
  cloudfrontURL,
  supportedLangs,
} from "@/config/constants";

export function isEnumValue<E>(enumObject: object, value: E) {
  return typeof enumObject === "object" ? Object.values(enumObject).includes(value) : false;
}

export const getImageUrl = (imageName: string): string => {
  return `${cloudfrontURL}/${imageName}`;
};

export function capitalizeFirstLetter(str: string): string {
  if (!str) {
    return "";
  }
  const firstLetter = str.charAt(0).toUpperCase();
  const restOfString = str.slice(1);
  return firstLetter + restOfString;
}

export const isValidLanguage = (language: string) => {
  return supportedLangs.includes(language);
};

export const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
};

export const setAuthHint = (): void => {
  document.cookie = `${AUTH_HINT_COOKIE_NAME}=true; max-age=${AUTH_HINT_MAX_AGE}; ${AUTH_HINT_COOKIE_ATTRS}`;
};

export const clearAuthHint = (): void => {
  document.cookie = `${AUTH_HINT_COOKIE_NAME}=; max-age=0; ${AUTH_HINT_COOKIE_ATTRS}`;
};

export const decodeJwtPayload = (token: string) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token structure");
    }

    const rawPayload = parts[1];

    const standardBase64 = rawPayload.replace(/-/g, "+").replace(/_/g, "/");

    const decodedString = atob(standardBase64);

    return JSON.parse(decodedString);
  } catch (error) {
    console.error("Failed to manually decode token:", error);
    return null;
  }
};
