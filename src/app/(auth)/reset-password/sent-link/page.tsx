import Image from "next/image";

import React from "react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const SentLink = () => {
  const t = useTranslations("Auth");

  return (
    <section className="m-auto flex w-full items-center justify-center px-4 sm:px-4 lg:flex lg:flex-row lg:gap-8 lg:px-12">
      <div className="hidden lg:flex lg:max-w-[55%] xl:max-w-none">
        <Image
          src={"/auth/welcome-desktop.png"}
          alt="welcome"
          width={756}
          height={864}
          priority
        />
      </div>

      <div className="mx-auto flex flex-col gap-8 self-center">
        <div className="self-center">
          <Image
            src={"/auth/link-sent.png"}
            alt="success"
            width={136}
            height={136}
          />
        </div>

        <div className="flex flex-col gap-8 lg:px-8">
          <h1 className="text-center text-2xl font-bold text-black">
            {t("resetPassword")}
          </h1>

          <p className="text-center text-sm font-medium text-gray-300">
            {t("checkYoureEmailForALinkToResetYourPassword")}
            <br /> {t("ifItDoesntAppearWithinAFewMinutesCheckYourSpamFolder")}
          </p>
          <Button className="w-full" asChild>
            <Link href={"/sign-in"}>{t("backToLogIn")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SentLink;
