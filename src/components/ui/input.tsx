import * as React from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";

import { cn } from "@/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  label?: string;
  errorMessage?: string;
  isError?: boolean;
  required?: boolean;
  classNames?: {
    container?: string;
    label?: string;
    error?: string;
  };
}

function Input({
  className,
  classNames,
  type,
  label,
  startIcon,
  endIcon,
  errorMessage,
  isError,
  required,
  ...props
}: React.ComponentProps<"input"> & InputProps) {
  const [isVisiblePassword, setIsVisiblePassword] = React.useState(false);
  return (
    <>
      <div className={cn("w-full", classNames?.container)}>
        {label && (
          <label
            className={cn(
              "mb-1 flex items-center gap-1 text-sm font-medium text-gray-300 sm:text-base sm:font-normal sm:text-black",
              classNames?.label,
            )}
          >
            <span>{label}</span>

            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative flex h-fit w-full items-center">
          {startIcon && <span className="absolute left-4">{startIcon}</span>}

          <input
            type={isVisiblePassword ? "text" : type}
            className={cn(
              "focus-visible:ring-blue h-14 w-full flex-1 rounded-lg border py-2 pr-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-lg",
              isError ? "border-red-500" : "border-input bg-background",
              startIcon ? "pl-12" : "pl-3",
              className,
            )}
            {...props}
          />

          {(type === "password" || isVisiblePassword) && (
            <span
              className="absolute right-4 cursor-pointer"
              onClick={() => setIsVisiblePassword((prev) => !prev)}
            >
              {isVisiblePassword ? (
                <FaRegEye size={22} className="text-gray-300" />
              ) : (
                <FaRegEyeSlash size={24} className="text-gray-300" />
              )}
            </span>
          )}

          {endIcon && type !== "password" && (
            <span className="absolute right-4">{endIcon}</span>
          )}
        </div>

        {isError && errorMessage && (
          <div
            className={cn(
              "mt-2 flex items-center text-sm font-medium text-red-500",
              classNames?.error,
            )}
          >
            <span className="mr-2 text-lg">•</span>

            {errorMessage}
          </div>
        )}
      </div>
    </>
  );
}

export { Input };
