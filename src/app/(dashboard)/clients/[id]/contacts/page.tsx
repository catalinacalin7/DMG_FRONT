"use client";

import React, { useContext } from "react";
import ContactsList from "@/features/client/contacts/ContactsList";
import { AbilityContext } from "@/lib/AbilityContext";
import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";

const ContactPage = () => {
  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "client-contacts")) {
    return <RestrictedAccessScreen />;
  }
  return <ContactsList />;
};

export default ContactPage;
