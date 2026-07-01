"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

const ResetPasswordEmailPage = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(360);

  const t = useTranslations("Auth");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <section className="flex h-full flex-col justify-between px-6">
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-black">
            {t("verificationCode")}
          </h1>

          <p className="text-sm font-medium text-gray-300">
            {t("pleaseEnterVerificationCodeWeSentItToNumber")}{" "}
            <span className="text-black">+1 0100-666-7206</span>
          </p>
        </div>

        <InputOTP maxLength={4}>
          <InputOTPSlot index={0} />

          <InputOTPSlot index={1} />

          <InputOTPSlot index={2} />

          <InputOTPSlot index={3} />
        </InputOTP>

        <p className="text-sm font-medium text-gray-300">
          {t("resendCodeIn")}{" "}
          <span className="text-blue-600">{formatTime(timeLeft)}</span>
        </p>
      </div>

      <Button
        className="font-bold"
        onClick={() => router.push("/reset-password/new-password")}
      >
        {t("verify")}
      </Button>
    </section>
  );
};

export default ResetPasswordEmailPage;
