export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function withLocale(locale: Locale, path = ""): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") {
    return `/${locale}/`;
  }
  return `/${locale}${clean}`;
}

export function stripLocale(pathname: string): string {
  for (const locale of locales) {
    const prefix = `/${locale}`;
    if (pathname === prefix || pathname === `${prefix}/`) {
      return "/";
    }
    if (pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length) || "/";
    }
  }
  return pathname || "/";
}
