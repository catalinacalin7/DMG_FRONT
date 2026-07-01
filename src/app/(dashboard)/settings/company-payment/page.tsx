"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteCompanyPayment,
  getCompany,
  getCompanyAvatar,
  getCompanyPayment,
  getCompanyPayments,
} from "@/api/company/company";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingScreen from "@/components/LoadingScreen";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useContext, useState } from "react";
import { AbilityContext } from "@/lib/AbilityContext";
import CompanyPaymentForm from "@/features/settings/company-payment/CompanyPayment";
import { CompanyPaymentData } from "@/types/company";
import { Divide, Pencil, Trash2 } from "lucide-react";
import DialogBox from "@/components/dialogs/DialogBox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";

const CompanyPayment = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [payment, setPayment] = useState({});
  const [itemId, setItemId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const tActions = useTranslations("ToastActions");
  const t = useTranslations("Settings.CompanyPayment");
  const tNav = useTranslations("Navigation");
  const tUI = useTranslations("ui");

  const { data: companyPaymentData, isLoading: isLoadingCompanyPaymentData } =
    useQuery({
      queryKey: [QUERY_KEYS.companyPayment],
      queryFn: () => getCompanyPayments(),
    });

  const ability = useContext(AbilityContext);

  const deleteCompanyPaymentMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteCompanyPayment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.companyPayment],
      });
      toast.success(tNav("paymentInfo"), {
        description: tActions("deleted"),
      });
    },
    onError: () => {
      toast.error(tNav("paymentInfo"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  const handleDelete = (id: string) => {
    deleteCompanyPaymentMutation.mutate(id);
  };

  if (!ability.can("manage", "company-payments")) {
    return <RestrictedAccessScreen />;
  }
  if (isLoadingCompanyPaymentData) return <LoadingScreen />;

  return (
    <div className="pt-6">
      <div className="flex justify-end py-3">
        <Button type="button" size="lg" onClick={() => setOpen(true)}>
          {tUI("buttons.create")}
        </Button>
        <Dialog
          open={isOpen}
          onOpenChange={(value) => {
            setOpen(value);
            if (!value) {
              setPayment({});
            }
          }}
        >
          <DialogContent className="px-4">
            <DialogHeader>
              <DialogTitle className="text-center">
                {t("addPaymentInfo")}
              </DialogTitle>
              <DialogDescription className="py-6 text-center text-base"></DialogDescription>
            </DialogHeader>
            <CompanyPaymentForm
              companyPaymentData={payment as CompanyPaymentData}
              onClose={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-3">
        {companyPaymentData.length > 0 &&
          companyPaymentData.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-lg border px-4 py-5 shadow-sm"
            >
              <div>
                <h3 className="flex items-center text-base font-medium text-black">
                  {payment.bankName.toUpperCase()}
                </h3>

                <p className="text-sm text-black">{payment.iban}</p>
                <p className="text-sm text-black">{payment.bic}</p>
              </div>

              <div className="flex gap-2 md:justify-end">
                <Button
                  size={"sm"}
                  variant={"secondary"}
                  onClick={() => {
                    setOpen(true);
                    setPayment(payment);
                  }}
                >
                  <Pencil size={18} className="text-muted-foreground" />
                </Button>
                <Button
                  size={"sm"}
                  variant={"secondary"}
                  onClick={(e) => {
                    setItemId(payment.id);
                    setDialogOpen(true);
                  }}
                >
                  <Trash2 size={18} className="text-red-500" />
                </Button>
              </div>
            </div>
          ))}
      </div>
      <div>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center">
                {t("deletePayment")}
              </DialogTitle>
              <DialogDescription className="py-6 text-center text-base">
                {t("doYouWantDeleteThisPayment")}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-row items-center justify-center gap-2 py-8 sm:flex sm:justify-center">
              <DialogClose asChild>
                <Button type="button" variant={"secondary"} size={"sm"}>
                  {tUI("buttons.cancel")}
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant={"destructive"}
                size={"sm"}
                onClick={() => {
                  setDialogOpen(false);
                  handleDelete(itemId as string);
                  setItemId(null);
                }}
              >
                {tUI("buttons.delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div></div>
    </div>
  );
};

export default CompanyPayment;
