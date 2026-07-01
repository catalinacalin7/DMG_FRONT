import { FormField, FormItem } from "../ui/form";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useFormContext } from "react-hook-form";
import { countries } from "countries-list";
import { useTranslations } from "next-intl";

function CountriesSelect({ required }: { required?: boolean }) {
  const t = useTranslations("PageClients");
  const tUI = useTranslations("ui");
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="country"
      render={({ field: { value, onChange, name } }) => {
        return (
          <FormItem className="grid grid-cols-1 place-items-start justify-items-start lg:grid-cols-2 lg:gap-4 xl:grid-cols-3">
            <Label className="text-nowrap text-[16px] font-semibold lg:pr-14">
              {t("country")}
              {required && "*"}
            </Label>
            <Select onValueChange={onChange} value={value} name={name}>
              <SelectTrigger className="py-7 text-[16px]">
                <SelectValue placeholder={tUI("placeholders.selectCountry")} />
              </SelectTrigger>

              <SelectContent defaultValue={value}>
                {Object.values(countries).map((item) => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        );
      }}
    />
  );
}
export default CountriesSelect;
