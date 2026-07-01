"use client";
import Image from "next/image";
import SignInSignUpForm from "./SignInSignUpForm";

const SignInPage = () => {
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
      <SignInSignUpForm />
    </div>
  );
};

export default SignInPage;
