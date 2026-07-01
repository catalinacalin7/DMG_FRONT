import ContactForm from "@/features/client/contacts/ContactForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Add Contact",
};

const AddContactPage = () => {
  return <ContactForm />;
};

export default AddContactPage;
