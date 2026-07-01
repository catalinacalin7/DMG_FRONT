"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, LoaderCircle, Plus, Search, Trash2 } from "lucide-react";

import { useParams } from "next/navigation";
import React, { useState } from "react";

import { deleteClientContact } from "@/api/client/contacts/delete";
import { getAllClientContacts } from "@/api/client/contacts/get-all";
import { Button } from "@/components/ui/button";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { onErrorToast } from "@/utils/onErrorToast";
import DialogBox from "@/components/dialogs/DialogBox";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

const ContactsList = () => {
  const t = useTranslations("PageClients");
  const tUI = useTranslations("ui");
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const { data: clientContacts, isLoading: isLoadingClientContacts } = useQuery(
    {
      queryKey: [QUERY_KEYS.clientContacts, id],
      queryFn: () => getAllClientContacts(id as string),
    },
  );

  const deleteContact = useMutation({
    mutationFn: async (contactId: number) =>
      await deleteClientContact(contactId as number),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.clientContacts, id],
      });

      router.replace(`/clients/${id}/contacts`);
    },
    onError: onErrorToast,
  });

  return (
    <div className="flex flex-1 flex-col justify-between gap-5">
      <div className="flex justify-end">
        <Button size="lg" asChild>
          <Link href={`${pathname}/add-contact`}>
            <Plus className="mr-1" />
            {tUI("buttons.createContact")}
          </Link>
        </Button>
      </div>
      {isLoadingClientContacts ? (
        <LoaderCircle className="h-10 w-10 animate-spin self-center text-blue-600" />
      ) : clientContacts && clientContacts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {clientContacts.map((item) => (
            <div
              key={item?.id}
              className="flex items-center justify-between rounded-xl border px-4 py-5 shadow-sm"
            >
              <div>
                <h3 className="flex items-center text-base font-medium text-black">
                  {item.name}
                </h3>
              </div>
              <div className="flex flex-wrap justify-center gap-4 lg:justify-end lg:gap-2 xl:flex-nowrap">
                <Button size={"sm"} variant={"secondary"}>
                  <Link
                    key={item.name}
                    href={`/clients/${id}/contacts/edit-contact/${item?.id}`}
                  >
                    <Eye size={18} className="text-muted-foreground" />
                  </Link>
                </Button>
                {/* <Button size={"sm"} variant={"secondary"}>
                    <Pencil size={18} className="text-muted-foreground" />
                  </Button> */}

                <DialogBox
                  dialogTriggerName={tUI("buttons.delete")}
                  dialogTitle={tUI("buttons.deleteContact")}
                  dialogDescription={t("areYouSureYouWantDeleteThisContact")}
                  open={isDialogOpen}
                  onOpenChange={setDialogOpen}
                  onAction={() => {
                    deleteContact.mutate(item.id as number);
                  }}
                  triggerIcon={<Trash2 size={18} className="text-red-500" />}
                  triggerVariant="secondary"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 text-center">
          <span className="rounded-full bg-blue-100 p-4">
            <Search className="text-blue-600" />
          </span>

          <div className="flex flex-col gap-1">
            <h2 className="font-semibold">{t("noContactsFound")}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsList;
