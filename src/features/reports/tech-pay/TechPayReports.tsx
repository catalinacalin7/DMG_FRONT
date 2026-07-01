"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { CloudDownload } from "lucide-react";

import { getMembers } from "@/api/company/members";
import { useQuery } from "@tanstack/react-query";

import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";

const enum memberRole {
  ADMIN = "ADMIN",
  TECHNICIAN = "TECHNICIAN",
  ALL = "ALL",
}

const TechPayReports = () => {
  const tN = useTranslations("PageHome");
  const t = useTranslations("Settings.Team");
  const tAuth = useTranslations("Auth");
  const tUI = useTranslations("ui");

  const [selectRole, setSelectRole] = useState(memberRole.ALL);

  const { data: membersListData, isLoading: isLoadingMembersListData } =
    useQuery({
      queryKey: ["members-reports"],
      queryFn: () => getMembers(),
    });
  if (isLoadingMembersListData) return <LoadingScreen />;

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4 md:gap-6">
        <FormInputWrapper>
          <Select
            value={selectRole}
            onValueChange={(value) => setSelectRole(value as memberRole)}
          >
            <SelectTrigger size="md" className="w-full">
              <SelectValue placeholder={tUI("placeholders.filterByClient")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={memberRole.ALL}>{t("all")}</SelectItem>
                <SelectItem value={memberRole.ADMIN}>{t("admin")}</SelectItem>
                <SelectItem value={memberRole.TECHNICIAN}>
                  {t("technician")}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormInputWrapper>

        {/* <div className="flex items-center">
          <Button
            variant="outline"
            className="h-[45px] sm:text-sm"
            startIcon={<CloudDownload className="h-6 w-6 text-gray-300" />}
          >
            {tUI("buttons.download")}
          </Button>
        </div> */}
      </div>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{tN("no")}</TableHead>
              <TableHead>{t("role")}</TableHead>
              <TableHead>{tAuth("name")}</TableHead>
              <TableHead>{tAuth("email")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {membersListData &&
              membersListData
                .filter(
                  (item) =>
                    selectRole === memberRole.ALL ||
                    item.user.role === selectRole,
                )
                .map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold text-black">
                      {index + 1}
                    </TableCell>

                    <TableCell className="font-bold text-black">
                      {item.user.role}
                    </TableCell>

                    <TableCell>{item.user.name}</TableCell>
                    <TableCell>{item.user.email}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      <div className="block space-y-4 pt-4 md:hidden">
        {membersListData &&
          membersListData
            .filter(
              (item) =>
                selectRole === memberRole.ALL || item.user.role === selectRole,
            )
            .map((item, index) => (
              <div
                key={item.id}
                className="flex w-full flex-col items-center justify-between gap-2 rounded-xl border p-4"
              >
                <div className="grid w-full grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                  <div className="flex justify-between border-b py-1">
                    <small className="pb-1">
                      {tN("no")} {index + 1}
                    </small>
                  </div>
                  <div className="flex flex-row items-center justify-between border-b py-1">
                    <small>{t("role")}:</small>
                    <div className="text-base font-medium text-black">
                      {item.user.role}
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between border-b py-1">
                    <small>{tAuth("name")}:</small>
                    <div className="text-base font-medium text-black">
                      {item.user.name}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between border-b py-1">
                    <small>{tAuth("email")}:</small>
                    <h3 className="text-right text-base font-medium">
                      {item.user.email}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </>
  );
};

export default TechPayReports;
