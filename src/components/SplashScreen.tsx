import Image from "next/image";
import React from "react";

const SplashScreen = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-blue-500">
      <div className="flex flex-col items-center gap-16">
        <Image
          src={"/splash/splash-logo.svg"}
          alt="dmg logo"
          width={200}
          height={200}
        />

        <Image
          src={"/splash/splash-dmg.svg"}
          alt="dmg company name"
          width={150}
          height={71}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
