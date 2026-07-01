"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

import React from "react";
import { useForm } from "react-hook-form";
import { HiOutlineMail } from "react-icons/hi";

import { postAuthForgotPassword } from "@/api/auth/forgot-password";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { restPasswordEmailFormValues } from "../../shared/constants/forms";
import { restPasswordEmailSchema } from "../../shared/schemas";
import { useTranslations } from "next-intl";
import * as yup from "yup";
import { Link, useRouter } from "@/i18n/navigation";

interface schemaType extends yup.InferType<typeof restPasswordEmailSchema> {}

const ResetPasswordEmailPage = () => {
  const router = useRouter();

  const t = useTranslations("Auth");

  const form = useForm<schemaType>({
    defaultValues: restPasswordEmailFormValues,
    resolver: yupResolver(restPasswordEmailSchema),
  });

  const mutation = useMutation({
    mutationFn: async (formData: typeof restPasswordEmailFormValues) => {
      await postAuthForgotPassword(formData);
    },
    onSuccess: () => {
      router.push(`/reset-password/sent-link`);
    },
    onError: () => {
      form.setError("email", {
        message: t("invalidEmail"),
      });
    },
  });

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

      <div className="xl:min-w-140 mx-auto flex flex-col justify-center gap-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (formData: typeof restPasswordEmailFormValues) =>
                mutation.mutate(formData),
            )}
            className="flex w-full flex-col gap-8 self-center lg:px-8"
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold">{t("recoverPassword")}</h1>
              <p className="text-gray-300">
                {t(
                  "enterAccountEmailBelowWeWillSendYouALinkToResetYourPassword",
                )}
              </p>
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field, formState }) => (
                <Input
                  type="email"
                  required
                  label={t("enterEmail")}
                  placeholder={t("enterEmail")}
                  startIcon={
                    <HiOutlineMail size={24} className="text-gray-300" />
                  }
                  isError={!!formState.errors.email}
                  {...field}
                />
              )}
            />
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
                <Button className="w-full" type="submit">
                  {t("sendResetLink")}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordEmailPage;
