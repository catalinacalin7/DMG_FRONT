import Image from "next/image";

import AuthRedirect from "@/components/AuthRedirect";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function Home() {
  return (
    <AuthRedirect>
      <main className="flex h-full flex-col gap-20 pb-10">
        <div className="relative h-[40vh] w-full">
          <Image
            src={"/splash/onboarding.png"}
            alt="onboarding"
            className="h-full w-full object-cover"
            width={375}
            height={300}
            priority
          />

          <div className="bg-linear-to-t absolute inset-0 from-white via-transparent to-transparent" />
        </div>

        <div className="flex flex-col gap-2 px-6 text-center">
          <h1 className="text-2xl font-bold text-black">
            Let&apos;s get started
          </h1>

          <p className="text-sm font-medium text-gray-300">
            To continue, please log in to see the initial estimate.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 px-6 text-center">
          <Button
            className="w-full font-bold md:max-w-[40%] lg:max-w-[30%]"
            asChild
          >
            <Link href={"/sign-in"}>Get Started</Link>
          </Button>

          <p className="text-sm text-gray-300">
            Don&apos;t have an account?{" "}
            <Link
              href={"/sign-in?page=sign-up"}
              className="font-bold text-blue-600"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </AuthRedirect>
  );
}
