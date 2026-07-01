import { defineRouting } from "next-intl/routing";
export const routing = defineRouting({
  locales: ["en", "ru", "de", "fr", "ro"],
  defaultLocale: "en",
  localePrefix: "never",
});
