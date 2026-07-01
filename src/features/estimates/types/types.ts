import { PanelSatus } from "@/api/estimates/estimates";

export type PdfLabels = {
  readonly estimateTitle: string;
  readonly make: string;
  readonly model: string;
  readonly vin: string;
  readonly year: string;
  readonly plateNo: string;
  readonly name: string;
  readonly taxID: string;
  readonly vatId: string;
  readonly address: string;
  readonly totalBeforeVat: string;
  readonly vat: string;
  readonly totalInclVat: string;
  readonly bankDetails: string;
  readonly iban: string;
  readonly bic: string;
  readonly bankName: string;
  readonly panelStatus: string;
  readonly pdr: string;
  readonly repairAndPaint: string;
  readonly change: string;
  readonly noDamage: string;
  readonly hOff: string;
  readonly panel: string,
  readonly impacts: string,
  readonly comments: string,
  readonly technicalDents: string,
  readonly technicalDentsAbr: string,
  readonly removeInstall: string,
  readonly dentsCount: number,
  readonly dentSize: string,
  readonly lightDents: string,
  readonly mediumDents: string,
  readonly strongDents: string,
};

export type Panel = {
  panel: string;
  light: string;
  medium: string;
  strong: string;
  technicalDentsCount: number;
  technicalDentsCost: number;
  panelStatus: PanelSatus;
  panelTotal: number;
  isAluminium: boolean;
  isRandI: boolean;
  rAndI: number;
  comment: string;
  addOns: { name: string; isPercentages: boolean; amount: number }[];
  estimatePanelLabel: { label: string }[];
};

export type CarBody = "suv" | "crossover" | "sedan" | "wagon" | "van" | "pickup_truck";