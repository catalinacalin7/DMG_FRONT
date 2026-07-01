"use client";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const NAME_TYPE = {
  "hail-france": "hailFrance",
  "france-remove-install": "r&iMatrixFrance",
  hail: "hail",
  randi: "r&i",
};

const FLAG_TYPE = {
  fr: "france.png",
  de: "germany.png",
};

function TypeMatrixList({
  data,
  mainTag,
  isLoading,
  flag,
}: {
  data: any;
  mainTag: string;
  isLoading: boolean;
  flag?: string;
}) {
  const formattedData = Array.isArray(data) ? data[0] : data;
  const t = useTranslations("Settings.Matrix");

  const router = useRouter();

  if (isLoading) return <LoadingScreen />;
  return (
    <div className="flex items-center justify-between rounded-xl border shadow-sm md:items-center">
      <div className="grid w-full grid-cols-[20%_80%] gap-4 md:grid-cols-[5%_95%] md:gap-6">
        <div className="relative overflow-hidden rounded-l-xl">
          {flag && (
            <Image
              src={`/matricesFlag/${FLAG_TYPE[flag]}`}
              alt="flag"
              fill
              className="scale-y-150 md:object-cover"
            />
          )}
        </div>
        <div className="py-8 md:py-6">
          <h3 className="flex items-center text-base font-medium text-black">
            {t(NAME_TYPE[mainTag])}
          </h3>
        </div>
      </div>
      <div className="pr-3 md:pr-6">
        <Button
          size={"sm"}
          variant={"secondary"}
          onClick={() =>
            router.push(
              `/settings/matrix/${mainTag}/${formattedData?.id ? `/${formattedData?.id}/edit` : "/create"}`,
            )
          }
        >
          <Pencil size={18} />
        </Button>
      </div>
    </div>
  );
}

export default TypeMatrixList;
