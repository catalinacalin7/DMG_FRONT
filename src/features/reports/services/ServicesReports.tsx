"use client";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { DateRange } from "react-day-picker";
import { CloudDownload } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getHailMatrices } from "@/api/matrices/hail-matrix";
import { getRandIMatrices } from "@/api/matrices/rAndi-matrix";

import { Button } from "@/components/ui/button";
import { DatePickerRange } from "@/components/DatePickerRange";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MatrixType } from "@/types/matrices";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";

const ServiceReports = () => {
  const t = useTranslations("Settings.Matrix");
  const tN = useTranslations("PageHome");
  const tUI = useTranslations("ui");
  const tMatrixType = useTranslations("PageScheduling");

  const matrixParam = [MatrixType.ALL, MatrixType.HAIL, MatrixType.RANDI];

  const [matrixType, setMatrixType] = useState(MatrixType.ALL);
  const [resetDate, setResetDate] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const {
    data: hailMatrix,
    isLoading: isLoadingHailMatrix,
    refetch: refetchMatrix,
  } = useQuery({
    queryKey: ["matrices-reports"],
    queryFn: () => getHailMatrices(),
  });
  const {
    data: rAndiMatrices,
    isLoading: isLoadingRandIMatrices,
    refetch: refetchRandIMatrix,
  } = useQuery({
    queryKey: ["randi-matrices-reports"],
    queryFn: () => getRandIMatrices(),
  });
  const filteredHailList = useMemo(() => {
    if (!hailMatrix) return [];
    if (matrixType === MatrixType.HAIL || matrixType === MatrixType.ALL)
      return hailMatrix;
    return [];
  }, [hailMatrix, matrixType]);

  const filteredRandIList = useMemo(() => {
    if (!rAndiMatrices) return [];
    if (matrixType === MatrixType.RANDI || matrixType === MatrixType.ALL)
      return rAndiMatrices;
    return [];
  }, [rAndiMatrices, matrixType]);

  const serviceList = useMemo(() => {
    return [...filteredHailList, ...filteredRandIList];
  }, [filteredHailList, filteredRandIList]);

  useEffect(() => {
    refetchMatrix();
    refetchRandIMatrix();
  }, [refetchMatrix, refetchRandIMatrix, matrixType]);
  const resetFilters = () => {
    setMatrixType(MatrixType.ALL);
    setDateRange(undefined);
    setResetDate((prev) => !prev);
  };
  if (isLoadingHailMatrix || isLoadingRandIMatrices) {
    return <LoadingScreen />;
  }
  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4 md:gap-6">
        <FormInputWrapper>
          <DatePickerRange
            onDataChange={setDateRange}
            resetTrigger={resetDate}
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <Select
            value={matrixType}
            onValueChange={(value) => setMatrixType(value as MatrixType)}
          >
            <SelectTrigger size="md" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {matrixParam?.map((item, index) => {
                  return (
                    <SelectItem key={index} value={item ?? ""}>
                      {tMatrixType(item)}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormInputWrapper>

        <div className="flex-row-revers flex w-full items-center md:flex-row">
          {dateRange && (
            <Button
              variant="ghost"
              className="text-blue-300"
              type="button"
              onClick={resetFilters}
            >
              {tUI("buttons.resetFilters")}
            </Button>
          )}
        </div>
      </div>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{tN("no")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("matrixNumber")}</TableHead>
              <TableHead>{t("created")}</TableHead>
              <TableHead>{t("name")}</TableHead>
              <TableHead className="text-center">{t("rate")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {serviceList &&
              serviceList.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold text-black">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-bold text-black">
                    {item.type}
                  </TableCell>
                  <TableCell className="text-x font-semibold">
                    {item.matrixNumber}
                  </TableCell>
                  <TableCell className="font-semibold text-black">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-x font-semibold">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-blue-600">
                    € {"rate" in item ? item.rate : 0}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="block space-y-4 pt-4 md:hidden">
        {serviceList &&
          serviceList.map((item, index) => (
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
                  <small>{t("type")}:</small>
                  <div className="text-base font-medium text-black">
                    {item.type}
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between border-b py-1">
                  <small>{t("matrixNumber")}:</small>
                  <h3 className="text-green text-base font-medium">
                    {item.matrixNumber}
                  </h3>
                </div>
                <div className="flex flex-row items-center justify-between border-b py-1">
                  <small>{t("created")}:</small>
                  <div className="text-base font-medium text-black">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between border-b py-1">
                  <small>{t("name")}:</small>
                  <div className="text-base font-medium text-black">
                    {item.name}
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between border-b py-1">
                  <small>{t("rate")}:</small>
                  <h3 className="text-base font-medium text-blue-600">
                    € {"rate" in item ? item.rate : 0}
                  </h3>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default ServiceReports;
