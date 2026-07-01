"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Check } from "lucide-react";
import Image from "next/image";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { postAuthResetPassword } from "@/api/auth/reset-password";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { newPasswordFormValues } from "../../shared/constants/forms";
import { newPasswordSchema } from "../../shared/schemas";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";

const hasSymbolRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+.])(?!.* ).{8,16}$/;

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const t = useTranslations("Auth");

  const token = searchParams.get("token");

  const form = useForm({
    defaultValues: newPasswordFormValues,
    resolver: yupResolver(newPasswordSchema),
  });

  const signUpPassword = form.watch("password");

  const isMinimalLength = signUpPassword.length >= 8;

  const isSymbol = hasSymbolRegex.test(signUpPassword);
  const canResetPassword = isMinimalLength && isSymbol ? true : false;

  const passwordsMatch =
    form.watch("password") === form.watch("confirmPassword") ? true : false;

  const mutation = useMutation({
    mutationFn: async (
      formData: typeof newPasswordFormValues & { token: string },
    ) => {
      await postAuthResetPassword({
        password: formData.password,
        token: token as string,
      });
    },
    onSuccess: () => {
      router.push("/reset-password/reset-success");
    },
    onError: (error: any) => {
      form.setError("password", {
        message: error?.response?.data,
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
          priority
        />
      </div>

      <div className="xl:min-w-140 mx-auto flex flex-col gap-8 self-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">{t("createNewPassword")}</h1>
          <p className="text-gray-300">{t("pleaseEnterTheNewPassword")}</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (formData: typeof newPasswordFormValues & { token: string }) =>
                mutation.mutate({
                  ...formData,
                  token: token || "",
                }),
            )}
            className="flex w-full flex-col gap-8"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <Input
                  label={t("password")}
                  type="password"
                  placeholder={t("enterPassword")}
                  {...field}
                  autoComplete={t("newPassword")}
                />
              )}
            />
            <div className="mt-[-20px]">
              <div className="flex items-center gap-2">
                <Check
                  size={20}
                  className={cn(
                    "text-[#175CD340] transition-all",
                    isMinimalLength && "text-blue-600",
                  )}
                />

                <span className="text-xs">{t("atLeast8Characters")}</span>
              </div>

              <div className="flex items-center gap-2">
                <Check
                  size={20}
                  className={cn(
                    "text-[#175CD340] transition-all",
                    isSymbol && "text-blue-600",
                  )}
                />

                <span className="text-xs">
                  {t("containsANumberASymbolAnUppercaseCharacter")}
                </span>
              </div>
            </div>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <>
                  <Input
                    label={t("confirmPassword")}
                    type="password"
                    placeholder={t("enterPassword")}
                    autoComplete="new password"
                    isError={!passwordsMatch}
                    {...field}
                  />
                  <div
                    className={`${!!passwordsMatch && "invisible"} mt-[-25px] text-red-500`}
                  >
                    {t("passwordsDontMatch")}
                  </div>
                </>
              )}
            />

            <div className="flex gap-4">
              <Button variant={"outline"} className="w-full" asChild>
                <Link href={"/sign-in"} className="flex items-center gap-2">
                  <ArrowLeft />
                  <span>{t("goBack")}</span>
                </Link>
              </Button>
              <Button
                disabled={!canResetPassword || !passwordsMatch}
                className="w-full"
                type="submit"
              >
                {t("continue")}
              </Button>
            </div>
          </form>
        </Form>
        <div>
          <div className={`${!form.formState.errors.password && "invisible"}`}>
            <div className="py-2 text-center text-red-500">
              {t("itLooksLikeYouClickedOnAnInvalidPasswordResetLink")}
              <br />
              {t("pleaseTryAgain")}
            </div>
            <Button variant={"outline"} className="w-full" asChild>
              <Link
                href={`/reset-password`}
                className="flex items-center gap-2"
              >
                <span>{t("getNewLink")}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
