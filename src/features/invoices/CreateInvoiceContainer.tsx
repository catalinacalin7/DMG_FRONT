"use client";

import { getInvoice } from "@/api/invoices/invoices";
import LoadingScreen from "@/components/LoadingScreen";
import CreateInvoiceForm from "@/features/invoices/CreateInvoiceForm";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const CreateInvoiceContainer = () => {
  const { id } = useParams();

  const { data: invoice, isFetching: isFetchingInvoice } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoice(id as string),
    enabled: Boolean(id),
    refetchOnMount: "always",
    staleTime: 0,
    gcTime: 0,
    retry: true,
  });

  return id ? (
    invoice && !isFetchingInvoice ? (
      <CreateInvoiceForm invoice={invoice} id={id as string} />
    ) : (
      <LoadingScreen />
    )
  ) : null;
};

export default CreateInvoiceContainer;
