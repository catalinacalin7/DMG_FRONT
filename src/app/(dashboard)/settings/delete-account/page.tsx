"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAccount,
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
import { CompanyPaymentData, DeleteAccountData } from "@/types/company";
import { Divide, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";
import DeleteAccountForm from "@/features/settings/delete-account/DeleteAccountForm";

const DeleteAccount = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [payment, setPayment] = useState({});
  const [itemId, setItemId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const tAuth = useTranslations("Auth");
  const t = useTranslations("Settings.CompanyPayment");
  const tNav = useTranslations("Navigation");
  const tUI = useTranslations("ui");

  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "delete-account")) {
    return <RestrictedAccessScreen />;
  }

  return (
    <div className="pt-6">
      <div className="flex flex-col items-center justify-center py-3">
        <h3 className="py-8 text-3xl font-bold"> {tNav("deleteAccount")}</h3>
        <div>
          <Button
            type="button"
            size="lg"
            variant="destructive"
            onClick={() => setOpen(true)}
          >
            {tUI("buttons.delete")}
          </Button>
        </div>
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
                {tNav("deleteAccount")}
              </DialogTitle>
              <DialogDescription className="py-6 text-center text-base">
                {tAuth("deleteAccountMessage")}
              </DialogDescription>
            </DialogHeader>
            <DeleteAccountForm onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div></div>
    </div>
  );
};

export default DeleteAccount;
