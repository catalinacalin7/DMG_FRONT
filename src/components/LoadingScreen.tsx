import { LoaderCircle } from "lucide-react";
import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-5 bg-white">
      <LoaderCircle className="h-10 w-10 animate-spin text-brand-dark" />
    </div>
  );
};

export default LoadingScreen;
