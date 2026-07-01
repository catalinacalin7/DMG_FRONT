import Image from "next/image";

import React from "react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const SignUpSuccessPage = () => {
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
      <div className="mx-auto flex flex-col items-center justify-center gap-8 self-center text-center">
        <Image
          src={"/auth/sign-up-success.png"}
          alt="success"
          width={180}
          height={180}
        />

        <div className="flex flex-col gap-2">
          <h1 className="text-center text-2xl font-bold text-black">
            {t("accountCreatedSuccessfully")}!
          </h1>

          <p className="text-center text-sm font-medium text-gray-300">
            {t("welcomeAboardStartYourSuccessJourneyWith")} Estimate Master!
          </p>
        </div>
        <Button className="h-12 w-[210px] rounded-lg">
          <Link href={`/home`}>{t("letsStart")}!</Link>
        </Button>
      </div>
    </section>
  );
};

export default SignUpSuccessPage;
