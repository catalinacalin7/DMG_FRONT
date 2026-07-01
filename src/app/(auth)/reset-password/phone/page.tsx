"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

const ResetPasswordEmailPage = () => {
  const router = useRouter();

  const t = useTranslations("Auth");

  return (
    <section className="flex h-full flex-col justify-center gap-4 px-6">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-black">
            {t("resetPassword")}
          </h1>

          <p className="text-sm font-medium text-gray-300">
            {t("enterYourPhoneNumberWeWillSendYouTheConfirmationCode")}
          </p>
        </div>

        <PhoneInput />
      </div>

      <Button
        className="font-bold"
        onClick={() => router.push("/reset-password/verification-code")}
      >
        {t("sendCodeNumber")}
      </Button>
    </section>
  );
};

export default ResetPasswordEmailPage;
