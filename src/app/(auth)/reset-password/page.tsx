"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const ResetPasswordPage = () => {
  const router = useRouter();
  const t = useTranslations("Auth");

  const [selectedMethod, setSelectedMethod] = useState<
    "email" | "phone" | null
  >(null);

  return (
    <div className="m-auto flex w-full items-center justify-center px-4 sm:p-0 lg:flex lg:flex-row lg:gap-8 lg:px-12">
      <div className="hidden lg:flex lg:max-w-[55%] xl:max-w-none">
        <Image
          src={"/auth/welcome-desktop.png"}
          alt="welcome"
          width={756}
          height={864}
        />
      </div>

      <div className="xl:min-w-140 mx-auto flex flex-col gap-8 self-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">{t("recoverPassword")}</h1>

          <p className="text-gray-300">
            {t("selectAPasswordRecoveryMethodAndClickTheContinueButton")}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div
            onClick={() => setSelectedMethod("email")}
            className={cn(
              "flex cursor-pointer items-start gap-4 rounded-lg border border-solid p-4 transition-all",
              selectedMethod === "email" && "cursor-default border-blue-500",
            )}
          >
            <HiOutlineMail
              size={30}
              className={cn(
                "text-gray-300 transition-all",
                selectedMethod === "email" && "text-blue-600",
              )}
            />

            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-bold text-black">{t("email")}</h2>

              <p className="text-xs font-medium text-gray-300">
                {t("enterYourEmailWeWillSendYouConfirmationCode")}
              </p>
            </div>
          </div>

          <div
            onClick={() => setSelectedMethod("phone")}
            className={cn(
              "flex cursor-pointer items-start gap-4 rounded-lg border border-solid p-4 transition-all",
              selectedMethod === "phone" && "cursor-default border-blue-500",
            )}
          >
            <HiOutlinePhone
              size={30}
              className={cn(
                "text-gray-300 transition-all",
                selectedMethod === "phone" && "text-blue-600",
              )}
            />

            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-bold text-black">{t("phone")}</h2>

              <p className="text-xs font-medium text-gray-300">
                {t("enterYourPhoneNumberWeWillSendYouTheConfirmationCode")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-full">
            <Button variant={"outline"} className="w-full" asChild>
              <Link href={"/sign-in"} className="flex items-center gap-2">
                <ArrowLeft />

                <span>{t("goBack")}</span>
              </Link>
            </Button>
          </div>

          <div className="w-full">
            <Button
              className="w-full"
              onClick={() =>
                router.push(
                  selectedMethod === "email"
                    ? "/reset-password/email"
                    : "/reset-password/phone",
                )
              }
            >
              {t("continue")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
