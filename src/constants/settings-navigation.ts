import { LANGUAGES_LIST } from "@/components/switches/LanguageSwitcher";
import {
  Bell,
  Building2,
  FileText,
  Languages,
  SquarePlus,
  UserRound,
  UserRoundPen,
  Landmark
} from "lucide-react";

export const SETTINGS_NAVIGATION = [
  {
    title: "companyInfo",
    icon: Building2,
    href: "company-info",
  },
  {
    title: "companyPayment",
    icon: Landmark,
    href: "company-payment",
  },
  {
    title: "invoiceSettings",
    icon: Landmark,
    href: "invoice-settings",
  },
  {
    title: "accountPreference",
    icon: UserRound,
    href: "account-preference",
  },
  {
    title: "team",
    icon: UserRoundPen,
    href: "team",
  },
  {
    title: "matrix",
    icon: FileText,
    href: "matrix",
  },
  // {
  //   title: "addOns",
  //   icon: SquarePlus,
  //   href: "add-ons",
  // },
  {
    title: "deleteAccount",
    icon: SquarePlus,
    href: "delete-account",
  },
  // {
  //   title: "notifications",
  //   icon: Bell,
  //   href: "/settings/notifications",
  // },
  {
    title: "language",
    icon: Languages,
    href: "#",
    collapsible: LANGUAGES_LIST,
  },
];
