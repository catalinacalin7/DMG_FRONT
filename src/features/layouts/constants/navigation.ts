import {
  Calculator,
  CalendarDays,
  FileChartColumn,
  LayoutGrid,
  ReceiptText,
  Share2,
  Users,
} from "lucide-react";

export const SIDEBAR_DESKTOP_NAVIGATION = [
  {
    title: "dashboard",
    url: "/home",
    icon: LayoutGrid,
  },
  {
    title: "scheduling",
    url: "/scheduling",
    icon: CalendarDays,
  },
  {
    title: "clients",
    url: "/clients",
    icon: Users,
  },
  {
    title: "estimates",
    url: "/estimates",
    icon: Calculator,
  },
  {
    title: "workflow",
    url: "/workflow",
    icon: Share2,
  },
  {
    title: "invoices",
    url: "/invoices",
    icon: ReceiptText,
  },
  {
    title: "reports",
    url: "/reports/invoices",
    icon: FileChartColumn,
  },
];
