const DOMAIN_REGEX = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;

export const isValidDomain = (domain: string): boolean => domain.length <= 253 && DOMAIN_REGEX.test(domain);
