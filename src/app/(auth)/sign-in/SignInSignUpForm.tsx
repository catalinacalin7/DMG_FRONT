"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import Image from "next/image";

import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { postAuthLogin } from "@/api/auth/login";
import { register } from "@/api/users/users";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { cn } from "@/utils/cn";
import { getPasswordStrength } from "@/utils/getPasswordStrength";

import { signInFormValues, signUpFormValues } from "../shared/constants/forms";
import { signInSchema, signUpSchema } from "../shared/schemas";
import { LoginForm, SignUpForm } from "../shared/types/forms";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/switches/LanguageSwitcher";
import { Link, useRouter } from "@/i18n/navigation";

const hasSymbolRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+.])(?!.* ).{8,}$/;

const SignInSignUpForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const t = useTranslations("Auth");

  const page = searchParams.get("page");

  const [activeTab, setActiveTab] = useState(
    page === "sign-up" ? "sign-up" : "sign-in",
  );

  const formSignIn = useForm({
    defaultValues: signInFormValues,
    resolver: yupResolver(signInSchema),
  });

  const formSignUp = useForm({
    defaultValues: signUpFormValues,
    resolver: yupResolver(signUpSchema),
  });

  const submitSignInFormMutation = useMutation({
    mutationFn: async (formData: LoginForm) => {
      await postAuthLogin(formData);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.userData],
      });

      router.push(`/home`);
    },
    onError(error: any) {
      formSignIn.setError("email", {
        message: error.response.data,
      });
      formSignIn.setError("password", {});
    },
  });

  const submitSignUpFormMutation = useMutation({
    mutationFn: async (formData: SignUpForm) => {
      await register(formData);
    },
    onSuccess() {
      router.push(`/sign-up-success`);
    },
    onError(error: any) {
      formSignUp.setError("email", {
        message:
          error?.response?.data.statusCode === 409
            ? "Email is invalid or already taken"
            : "",
      });
      formSignUp.setError("password", {
        message:
          error?.response?.data.statusCode === 400
            ? error.response.data.mesage
            : "",
      });
    },
  });

  const signUpEmail = formSignUp.watch("email");
  const signUpPassword = formSignUp.watch("password");

  const isMinimalLength = signUpPassword.length >= 8;
  const isNotEmail =
    !signUpPassword
      .toLowerCase()
      .includes(signUpEmail.split("@")[0].toLowerCase()) && signUpPassword;
  const isSymbol = hasSymbolRegex.test(signUpPassword);
  const canRegister = isMinimalLength && isSymbol ? true : false;

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value)}
        className="xl:min-w-140 mx-auto flex flex-col gap-8 self-center"
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={"/emaster.svg"} width={222} height={222} alt="logo" />
            {/* <h2 className="text-2xl font-bold">Estimate Master</h2> */}
          </div>

          <LanguageSwitcher />
        </div>

        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-in">{t("signIn")}</TabsTrigger>

          <TabsTrigger value="sign-up">{t("signUp")}</TabsTrigger>
        </TabsList>

        <TabsContent value="sign-in">
          <Form {...formSignIn}>
            <form
              onSubmit={formSignIn.handleSubmit((formData: LoginForm) =>
                submitSignInFormMutation.mutate(formData),
              )}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-6">
                <FormField
                  control={formSignIn.control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      type="email"
                      label={t("email")}
                      classNames={{
                        label: "text-base text-black",
                      }}
                      {...field}
                    />
                  )}
                />

                <FormField
                  control={formSignIn.control}
                  name="password"
                  render={({ field }) => (
                    <div className="relative">
                      <Input
                        type="password"
                        placeholder={t("enterPassword")}
                        label={t("password")}
                        classNames={{
                          label: "text-base text-black",
                        }}
                        {...field}
                      />

                      <Link
                        href={`/reset-password`}
                        className="absolute right-0 top-0 text-sm text-[#9C9AA5] underline"
                      >
                        {t("forgotPassword")}?
                      </Link>
                      <div className="pt-2 text-red-500">
                        {formSignIn.formState.errors.email &&
                          t("incorrectEmailOrPassword")}
                      </div>
                    </div>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="h-12 font-bold"
                disabled={submitSignInFormMutation.isPending}
              >
                {t("logIn")}
              </Button>

              <p className="text-center text-xs text-gray-300">
                By signing up to create an account I accept Company&apos;s{" "}
                <br />
                <span className="text-black">
                  Terms of use & Privacy Policy.
                </span>
              </p>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="sign-up">
          <Form {...formSignUp}>
            <form
              onSubmit={formSignUp.handleSubmit((formData: SignUpForm) =>
                submitSignUpFormMutation.mutate(formData),
              )}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-6">
                <FormField
                  control={formSignUp.control}
                  name="name"
                  render={({ field, formState }) => (
                    <>
                      <Input
                        type="name"
                        label={t("name")}
                        classNames={{
                          label: "text-base text-black",
                        }}
                        isError={!!formState.errors.name}
                        {...field}
                      />
                    </>
                  )}
                />

                <FormField
                  control={formSignUp.control}
                  name="email"
                  render={({ field, formState }) => (
                    <>
                      <Input
                        type="email"
                        label={t("email")}
                        classNames={{
                          label: "text-base text-black",
                        }}
                        isError={!!formState.errors.email?.message}
                        {...field}
                      />
                      <div className="mt-[-15px] text-red-500">
                        {formSignUp.formState.errors.email &&
                          formSignUp.formState.errors.email.message}
                      </div>
                    </>
                  )}
                />

                <FormField
                  control={formSignUp.control}
                  name="password"
                  render={({ field, formState }) => (
                    <div className="flex flex-col gap-2">
                      <Input
                        type="password"
                        placeholder={t("enterPassword")}
                        label={t("password")}
                        classNames={{
                          label: "text-base text-black",
                        }}
                        isError={!!formState.errors.password?.message}
                        {...field}
                      />

                      <div className="flex items-center gap-2">
                        <Check
                          size={20}
                          className={cn(
                            "text-[#175CD340] transition-all",
                            isNotEmail &&
                              isMinimalLength &&
                              isSymbol &&
                              "text-blue-600",
                          )}
                        />

                        <span className="text-xs capitalize">
                          {t("passwordStrength")} :{" "}
                          {getPasswordStrength(signUpPassword, signUpEmail)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Check
                          size={20}
                          className={cn(
                            "text-[#175CD340] transition-all",
                            isNotEmail && "text-blue-600",
                          )}
                        />

                        <span className="text-xs">
                          {t("cannotContainYourNameOrEmailAddress")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Check
                          size={20}
                          className={cn(
                            "text-[#175CD340] transition-all",
                            isMinimalLength && "text-blue-600",
                          )}
                        />

                        <span className="text-xs">
                          {t("atLeast8Characters")}
                        </span>
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
                  )}
                />
              </div>

              <Button
                type="submit"
                className="h-12 font-bold"
                disabled={!canRegister || submitSignUpFormMutation.isPending}
              >
                {t("createAccount")}
              </Button>

              <p className="text-center text-xs text-gray-300">
                By signing up to create an account I accept Company&apos;s{" "}
                <br />
                <span className="text-black">
                  Terms of use & Privacy Policy.
                </span>
              </p>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SignInSignUpForm;
