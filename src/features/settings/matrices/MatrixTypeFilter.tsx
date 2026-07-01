"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

function MatrixTypeFilter() {
  const t = useTranslations("Settings.Matrix");
  const tUI = useTranslations("ui");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSetMatrixType = useDebouncedCallback(
    (term: string | undefined) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set("matrix", term);
      } else {
        params.delete("query");
      }
      replace(`${pathname}?${params.toString()}`);
    },
    300,
  );
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
      <Select
        onValueChange={handleSetMatrixType}
        name="matrices"
        value={searchParams.get("matrix") || undefined}
      >
        <SelectTrigger size="md" className="text-[16px]">
          <SelectValue placeholder={tUI("placeholders.filterMatrixByType")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("all")}</SelectItem>
          <SelectItem value="hail">{t("hail")}</SelectItem>
          <SelectItem value="r-and-i">{t("r&i")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
export default MatrixTypeFilter;
