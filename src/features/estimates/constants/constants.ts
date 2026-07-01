import { FileText } from "lucide-react";

export const HAIL_ESTIMATE_NAVIGATION = [
  {
    title: "estimate",
    icon: FileText,
    href: "estimate",
  },
];

export const HAIL_ESTIMATE_MANUAL_NAVIGATION = [
  {
    title: "estimate-france",
    icon: FileText,
    href: "estimate-france",
  },
];

export const getEditNav = (estimateId: string) => [
  {
    title: "edit",
    icon: FileText,
    href: `estimates/${estimateId}/edit`,
  },
  {
    title: "media",
    icon: FileText,
    href: `estimates/${estimateId}/media`,
  }
]

export const EDIT_ESTIMATE_NAV = [
  {
    title: "edit",
    icon: FileText,
    href: `edit`,
  },
  {
    title: "media",
    icon: FileText,
    href: `media`,
  },
  {
    title: "view",
    icon: FileText,
    href: `view`,
  }
]

export const Panels = [
  "hood",
  "leftFrontFender",
  "leftFrontDoor",
  "leftRocker",
  "leftRearDoor",
  "leftQuarter",
  "rightFrontFender",
  "rightFrontDoor",
  "rightRocker",
  "rightRearDoor",
  "rightQuarter",
  "roof",
  "leftRail",
  "rightRail",
  "trunk",
  "windScreenFrame",
  "cowl",
];
