import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const localeFromCookie =
    (await cookieStore).get("NEXT_LOCALE")?.value ?? "en";

  const locale = localeFromCookie;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
