import { AxiosError } from "axios";

import { toast } from "@/components/ui/use-toast";

export const onErrorToast = (error: AxiosError<any>) => {
  if (Array.isArray(error.response?.data?.message)) {
    error.response?.data?.message.map((item: string) =>
      toast({
        description: item,
        variant: "destructive",
        duration: 3000,
      }),
    );

    return;
  }

  if (typeof error.response?.data?.message === "string") {
    toast({
      description: error.response?.data?.message,
      variant: "destructive",
      duration: 3000,
    });
  }
};
