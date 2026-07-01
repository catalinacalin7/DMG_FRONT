import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-brand-dark text-white shadow-xs hover:bg-brand-light",
        destructive:
          "bg-red-500 text-white shadow-xs hover:bg-red-500/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        accent:
          "bg-orange-600 text-white shadow-xs hover:bg-orange-600/85 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-gray-100 text-secondary-foreground shadow-xs hover:bg-gray-200/90",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-14 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  startIcon,
  endIcon,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  } & ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return asChild ? (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ) : (
    <button
      className={cn(
        "cursor-pointer",
        buttonVariants({ variant, size, className }),
      )}
      {...props}
    >
      {startIcon && <span className="mr-[10px]">{startIcon}</span>}

      {props.children}

      {endIcon && <span className="ml-[10px]">{endIcon}</span>}
    </button>
  );
}

export { Button, buttonVariants };
