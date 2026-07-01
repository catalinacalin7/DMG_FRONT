"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { createClientContact } from "@/api/client/contacts/create";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ClientContactData } from "@/types/clients";
import { toast } from "sonner";
import TextInput from "@/components/inputs/TextInput";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";
import { updateClientContact } from "@/api/client/contacts/update";
import { getClientContact } from "@/api/client/contacts/get-by-id";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

const clientContactSchema = yup.object().shape({
  email: yup.string().email().required(),
  jobTitle: yup.string().required(),
  name: yup.string().required(),
  phone: yup.string().required(),
});

const ContactForm = () => {
  const tUI = useTranslations("ui");
  const tAuth = useTranslations("Auth");
  const t = useTranslations("PageClients");
  const { id, contactId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: clientContactData, isLoading: isLoadingClientContactData } =
    useQuery({
      queryKey: [QUERY_KEYS.clientContacts, contactId],
      queryFn: () => getClientContact(contactId as string),
      enabled: !!contactId,
    });

  const form = useForm({
    values: clientContactData ?? {
      email: "",
      jobTitle: "",
      name: "",
      phone: "",
    },
    resolver: yupResolver(clientContactSchema),
  });

  const createContact = useMutation({
    mutationFn: async (formData: ClientContactData) =>
      await createClientContact(formData, id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.clientContacts, contactId],
      });
      toast.success(t("contacts"), {
        description: t("created"),
      });
      router.replace(`/clients/${id}/contacts`);
    },
    onError: () => {
      toast.error(t("contacts"), {
        description: t("somethingWentWrong"),
      });
    },
  });

  const updateContact = useMutation({
    mutationFn: async (formData: ClientContactData) =>
      await updateClientContact(formData, contactId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.clientContacts, contactId],
      });
      toast.success(t("contacts"), {
        description: t("updated"),
      });
      router.replace(`/clients/${id}/contacts`);
    },
    onError: () => {
      toast.error(t("contacts"), {
        description: t("somethingWentWrong"),
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((formData) => {
          if (contactId) {
            updateContact.mutate(formData as ClientContactData);
          } else {
            createContact.mutate(formData as ClientContactData);
          }
        })}
      >
        <div className="flex w-full flex-col">
          <FormInputWrapper>
            <TextInput fieldName="name" fieldLabel={tAuth("name")} required />
          </FormInputWrapper>

          <FormInputWrapper>
            <TextInput
              fieldName="jobTitle"
              fieldLabel={t("jobTitle")}
              required
            />
          </FormInputWrapper>

          <FormInputWrapper>
            <TextInput fieldName="phone" fieldLabel={tAuth("phone")} required />
          </FormInputWrapper>

          <FormInputWrapper>
            <TextInput fieldName="email" fieldLabel={tAuth("email")} required />
          </FormInputWrapper>
        </div>

        <div className="flex justify-end gap-2 py-4">
          <Button
            type="button"
            size="lg"
            variant={"secondary"}
            onClick={() => {
              router.push(`/clients/${id}/contacts`);
            }}
          >
            {tUI("buttons.cancel")}
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={createContact.isPending || updateContact.isPending}
          >
            {tUI("buttons.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
