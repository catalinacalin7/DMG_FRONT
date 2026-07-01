"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { getPermissions, savePermissions } from "@/api/permissions/permissions";
import { useState } from "react";
import { AxiosError } from "axios";
import PermissionCheckboxInput from "@/components/inputs/PermissionCheckboxInput";
import { toast } from "sonner";

export const routes = [
  "dashboard", //0
  "schedulings", //1
  "estimates", //2
  "workflow", //3
  "invoices", //4
  "invoices-settings", //5
  "reports", //6
  "clients", //7
  "client-info", //8
  "client-payments", //9
  "vehicles", //10
  "client-contacts", //11
  "company", //12
  "company-payments", //13
  "permissions", //14
  "team", //15
  "matrix", //16
  "add-ons", //17
];

type Permissions = {
  role: string;
  permissionRoutes: { subject: string }[];
  action: string;
};

type DBPermissions = {
  role: string;
  subject: string;
  action: string;
};

const defaultFormValues = {
  role: "",
  permissionRoutes: [],
  action: "manage",
};

const rolesPermissionsSchema = yup.object().shape({
  role: yup.string().required("Role is required"),
  permissionRoutes: yup
    .array()
    .of(
      yup.object().shape({
        subject: yup.string(),
      }),
    )
    .required()
    .min(1, "At least one route should be selected"),
  action: yup.string().default("manage"),
});

type RolesPermissionsType = yup.InferType<typeof rolesPermissionsSchema>;

const AccountPreference = () => {
  const [role, setRole] = useState<string>("");
  const tUI = useTranslations("ui");
  const tActions = useTranslations("ToastActions");
  const t = useTranslations("Navigation");
  const tAccountPreference = useTranslations("Settings.Account-Preference");
  const queryClient = useQueryClient();

  const { data: permissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: [QUERY_KEYS.permissions, role],
    queryFn: () => getPermissions(role),
    enabled: !!role,
  });

  const dbPermissions =
    permissions && permissions?.length > 0
      ? permissions?.reduce(
          (acc: Permissions, item: DBPermissions) => {
            if (item.role === "ADMIN") {
              acc.role = item.role;
              acc.permissionRoutes = routes.map((perm) => {
                return {
                  subject: perm,
                };
              });
              acc.action = item.action;
              return acc;
            }
            acc.role = item.role;
            acc.permissionRoutes.push({
              subject: item.subject,
            });
            acc.action = item.action;
            return acc;
          },
          { role: "", permissionRoutes: [], action: "" } as Permissions,
        )
      : {
          role: role,
          permissionRoutes: [],
          action: "manage",
        };

  const form = useForm<RolesPermissionsType>({
    values: dbPermissions ?? defaultFormValues,
    resolver: yupResolver(rolesPermissionsSchema),
    shouldUnregister: false,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "permissionRoutes",
  });

  const submitFormMutation = useMutation({
    mutationFn: async (formData: Permissions) => {
      const permissions = formData.permissionRoutes?.map((perm) => {
        return {
          action: "manage",
          role: formData.role,
          subject: perm.subject,
        };
      });
      await savePermissions(permissions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.permissions],
      });

      toast.success(t("accountPreference"), {
        description: tActions("updated"),
      });
    },
    onError: () => {
      toast.error(t("companyPayment"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  const existingRoute = (route: string) => {
    const currentRoutes = form.watch("permissionRoutes") as Record<
      string,
      string
    >[];
    const index = currentRoutes?.findIndex((t) => t.subject === route);
    return index;
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((formData) =>
            submitFormMutation.mutate(formData as Permissions),
          )}
        >
          <div className="pt- lg:border-b lg:py-8">
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 place-items-start justify-items-start lg:grid-cols-2 lg:gap-4 xl:grid-cols-3">
                      <FormLabel className="text-nowrap text-[16px] font-semibold lg:pr-14">
                        Roles
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          setRole(value);
                          field.onChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger size="md">
                            <SelectValue
                              placeholder={tAccountPreference("selectRole")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                          <SelectItem value="SALES_MANAGER">
                            Sales Manager
                          </SelectItem>
                          <SelectItem value="TECHNICIAN">Technician</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            />
          </div>
          <div
            key={role}
            className={`${role === "ADMIN" ? "pointer-events-none" : ""} flex flex-col py-4 lg:border-b`}
          >
            <h5 className="pb-2 text-xs text-gray-500">
              ({tAccountPreference("selectCheckboxPermissionMessage")})
            </h5>
            <div className="flex flex-wrap gap-12">
              <div className="flex flex-col gap-2 pt-1">
                <PermissionCheckboxInput
                  fieldName={routes[0]}
                  fieldLabel={t("dashboard")}
                  onAppend={() => append({ subject: "dashboard" })}
                  onRemove={() => {
                    const index = existingRoute("dashboard");
                    remove(index);
                  }}
                />
                <PermissionCheckboxInput
                  fieldName={routes[1]}
                  fieldLabel={t("schedulings")}
                  onAppend={() => append({ subject: "schedulings" })}
                  onRemove={() => {
                    const index = existingRoute("schedulings");
                    remove(index);
                  }}
                />
                <PermissionCheckboxInput
                  fieldName={routes[2]}
                  fieldLabel={t("estimates")}
                  onAppend={() => append({ subject: "estimates" })}
                  onRemove={() => {
                    const index = existingRoute("estimates");
                    remove(index);
                  }}
                />
                <PermissionCheckboxInput
                  fieldName={routes[3]}
                  fieldLabel={t("workflow")}
                  onAppend={() => append({ subject: "workflow" })}
                  onRemove={() => {
                    const index = existingRoute("workflow");
                    remove(index);
                  }}
                />
                <PermissionCheckboxInput
                  fieldName={routes[4]}
                  fieldLabel={t("invoices")}
                  onAppend={() => append({ subject: "invoices" })}
                  onRemove={() => {
                    const index = existingRoute("invoices");
                    remove(index);
                  }}
                />
                <PermissionCheckboxInput
                  fieldName={routes[5]}
                  fieldLabel={t("invoiceSettings")}
                  onAppend={() => append({ subject: "invoices-settings" })}
                  onRemove={() => {
                    const index = existingRoute("invoices-settings");
                    remove(index);
                  }}
                />
                <PermissionCheckboxInput
                  fieldName={routes[6]}
                  fieldLabel={t("reports")}
                  onAppend={() => append({ subject: "reports" })}
                  onRemove={() => {
                    const index = existingRoute("reports");
                    remove(index);
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">Clients</h3>
                <PermissionCheckboxInput
                  fieldName={routes[7]}
                  fieldLabel={t("clients")}
                  onAppend={() => append({ subject: "clients" })}
                  onRemove={() => {
                    const index = existingRoute("clients");
                    remove(index);
                  }}
                />
                <PermissionCheckboxInput
                  fieldName={routes[8]}
                  fieldLabel={t("info")}
                  onAppend={() => append({ subject: "client-info" })}
                  onRemove={() => {
                    const index = existingRoute("client-info");
                    remove(index);
                  }}
                />
                <PermissionCheckboxInput
                  fieldName={routes[9]}
                  fieldLabel={t("paymentInfo")}
                  onAppend={() => append({ subject: "client-payments" })}
                  onRemove={() => {
                    const index = existingRoute("client-payments");
                    remove(index);
                  }}
                />
                <PermissionCheckboxInput
                  fieldName={routes[10]}
                  fieldLabel={t("garage")}
                  onAppend={() => append({ subject: "vehicles" })}
                  onRemove={() => {
                    const index = existingRoute("vehicles");
                    remove(index);
                  }}
                />
                <PermissionCheckboxInput
                  fieldName={routes[11]}
                  fieldLabel={t("contacts")}
                  onAppend={() => append({ subject: "client-contacts" })}
                  onRemove={() => {
                    const index = existingRoute("client-contacts");
                    remove(index);
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-lg font-semibold">Settings</p>
                <PermissionCheckboxInput
                  fieldName={routes[12]}
                  fieldLabel={t("companyInfo")}
                  onAppend={() => append({ subject: "company" })}
                  onRemove={() => {
                    const index = existingRoute("company");
                    remove(index);
                  }}
                />
                <PermissionCheckboxInput
                  fieldName={routes[13]}
                  fieldLabel={t("companyPayment")}
                  onAppend={() => append({ subject: "company-payments" })}
                  onRemove={() => {
                    const index = existingRoute("company-payments");
                    remove(index);
                  }}
                />
                <PermissionCheckboxInput
                  fieldName={routes[14]}
                  fieldLabel={t("accountPreference")}
                  onAppend={() => append({ subject: "permissions" })}
                  onRemove={() => {
                    const index = existingRoute("permissions");
                    remove(index);
                  }}
                />
                <PermissionCheckboxInput
                  fieldName={routes[15]}
                  fieldLabel={t("team")}
                  onAppend={() => append({ subject: "team" })}
                  onRemove={() => {
                    const index = existingRoute("team");
                    remove(index);
                  }}
                />
                <PermissionCheckboxInput
                  fieldName={routes[16]}
                  fieldLabel={t("matrix")}
                  onAppend={() => append({ subject: "matrix" })}
                  onRemove={() => {
                    const index = existingRoute("matrix");
                    remove(index);
                  }}
                />
                {/* <PermissionCheckboxInput
                  fieldName={routes[17]}
                  fieldLabel={t("addOns")}
                  onAppend={() => append({ subject: "add-ons" })}
                  onRemove={() => {
                    const index = existingRoute("add-ons");
                    remove(index);
                  }}
                /> */}
              </div>
            </div>
          </div>
          <div className="text-red-500">
            {form.formState.errors.permissionRoutes?.message &&
              "At least 1 route should be selected"}
          </div>

          <div className="flex justify-end gap-2 py-4">
            <Button size="lg" type="submit" disabled={role === "ADMIN"}>
              {tUI("buttons.save")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AccountPreference;
