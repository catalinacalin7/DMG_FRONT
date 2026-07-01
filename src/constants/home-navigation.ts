"use client";

import {
  Calculator,
  CalendarDays,
  FileChartColumn,
  ReceiptText,
  Share2,
  Users,
} from "lucide-react";
import ClientsIcon from "@/mobile-icons/ClientsIcon";
import EstimatesIcon from "@/mobile-icons/EstimatesIcon";
import InvoicesIcon from "@/mobile-icons/InvoicesIcon";
import SchedulingsIcon from "@/mobile-icons/SchedulingsIcon";
import WorkflowsIcon from "@/mobile-icons/WorkflowsIcon";
import ReportsIcon from "@/mobile-icons/ReportsIcon";

export const HOME_NAVIGATION = [
  {
    label: "scheduling",
    icon: SchedulingsIcon,
    href: "/scheduling",
  },
  {
    label: "clients",
    icon: ClientsIcon,
    href: "/clients",
  },
  {
    label: "estimates",
    icon: EstimatesIcon,
    href: "/estimates",
  },
  {
    label: "workflow",
    icon: WorkflowsIcon,
    href: "/workflow",
  },
  {
    label: "invoices",
    icon: InvoicesIcon,
    href: "/invoices",
  },
  {
    label: "reports",
    icon: ReportsIcon,
    href: "/reports/invoices",
  },
];
