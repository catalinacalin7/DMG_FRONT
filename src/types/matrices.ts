import { FranceHailTypeSchema } from "@/features/settings/matrices/hail-matrix-france-form/schema";

export type HailMatrix = {
  id: string;
  matrixNumber: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  type: MatrixType;
  rate: number;
  matrixData: HailMatrixData[];
};
export type HailMatrixData = {
  id: number;
  unit: string;
  light: number;
  medium: number;
  strong: number;
};

export type CreateHailMatrix = {
  // name: string;
  rate: number;
  matrixData: CreateHailMatrixData[];
};
export type CreateHailMatrixData = {
  unit: string;
  light: number;
  medium: number;
  strong: number;
};

export type UpdateHailMatrix = {
  name: string;
  rate: number;
  matrixData: UpdateHailMatrixData[];
};
export type UpdateHailMatrixData = {
  id: number;
  unit: string;
  light: number;
  medium: number;
  strong: number;
};

//create france-hail-matrix
export type CreateFranceHailMatrix = FranceHailTypeSchema;
export type UpdateFranceHailMatrix = FranceHailTypeSchema;

export enum MatrixType {
  HAIL = "hail",
  RANDI = "r&i",
  ALL = "all",
}

export type HailMatrixDataWithoutId = Omit<HailMatrixData, "id">;

export type RemoveAndInstallMatrix = {
  id: string;
  matrixNumber: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  type: MatrixType;
  hood: number;
  leftFrontFender: number;
  rightFrontFender: number;
  leftFrontDoor: number;
  rightFrontDoor: number;
  leftRearDoor: number;
  rightRearDoor: number;
  roof: number;
  leftRail: number;
  rightRail: number;
  leftQuarter: number;
  rightQuarter: number;
  trunkUp: number;
  trunkDown: number;
  companyId: number;
};

export type Matrices = {
  id: string;
  hailMatrixId: string;
  rAndIMatrixId: string;
  hailMatrix: HailMatrix;
  rAndIMatrix: RemoveAndInstallMatrix;
};
