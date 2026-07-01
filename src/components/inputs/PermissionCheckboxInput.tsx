"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Controller, useFormContext } from "react-hook-form";

type PermissionCheckboxInputProps = {
  fieldName: string;
  fieldLabel?: string | undefined;
  onAppend: () => void;
  onRemove: () => void;
  disabled?: boolean | undefined;
};

const PermissionCheckboxInput = ({
  fieldName,
  fieldLabel,
  onAppend,
  onRemove,
  disabled,
}: PermissionCheckboxInputProps) => {
  const { control, watch } = useFormContext();
  const existingRoute = (route: string) => {
    const currentRoutes = watch("permissionRoutes") as Record<string, string>[];
    const index = currentRoutes?.findIndex((t) => t.subject === route);
    return index;
  };
  return (
    <Controller
      control={control}
      name={fieldName}
      render={() => {
        return (
          <FormField
            control={control}
            name={fieldName}
            render={({ field }) => {
              return (
                <FormItem className="flex">
                  <div className="flex flex-col gap-2">
                    <FormControl>
                      <Checkbox
                        checked={existingRoute(fieldName) !== -1}
                        onCheckedChange={(checked) => {
                          if (checked === true) {
                            onAppend();
                          } else {
                            onRemove();
                          }
                          field.onChange(!!checked);
                        }}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-nowrap capitalize">
                      {fieldLabel}
                    </FormLabel>
                  </div>
                </FormItem>
              );
            }}
          />
        );
      }}
    />
  );
};

export default PermissionCheckboxInput;
