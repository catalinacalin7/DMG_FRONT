import ContactForm from "@/features/client/contacts/ContactForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Edit Contact",
};

const EditContactPage = () => {
  return <ContactForm />;
};

export default EditContactPage;
