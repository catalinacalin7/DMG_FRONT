import { HAIL_DEFAULT_FRANCE } from "@/constants/default-matrices";
import * as yup from "yup";

export const franceHailDataSchema = yup
  .array(
    yup.object().shape({
      min: yup.number(),
      max: yup.number(),
      unitsTime: yup
        .string()
        .required("This field is required.")
        .matches(
          /^\d+\.\d{2}$/,
          "Must be a number with two decimals.",
        ),
    }),
  )
  .required("Matrix unit data is required");

export const franceHailSchema = yup.object().shape({
  rate: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),

  // parameters
  light: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),
  medium: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),
  strong: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),
  aluminium: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),

  technicalDents: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),

  repairAndPaint: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),

  // cars elements
  cowl: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),
  door: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),
  fender: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),
  quarter: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),
  hood: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),
  windScreenFrame: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),
  roof: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),
  rail: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),
  trunk: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),
  rocker: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),

  franceHailData: franceHailDataSchema,
});

export type FranceHailTypeSchema = yup.InferType<typeof franceHailSchema>;

export const defaultFranceHailValues = {
  rate: (HAIL_DEFAULT_FRANCE.rate / 100).toFixed(2),
  light: (HAIL_DEFAULT_FRANCE.light / 100).toFixed(2),
  medium: (HAIL_DEFAULT_FRANCE.medium / 100).toFixed(2),
  strong: (HAIL_DEFAULT_FRANCE.strong / 100).toFixed(2),
  aluminium: (HAIL_DEFAULT_FRANCE.aluminium / 100).toFixed(2),
  technicalDents: (HAIL_DEFAULT_FRANCE.technicalDents / 100).toFixed(2),
  repairAndPaint: (HAIL_DEFAULT_FRANCE.repairAndPaint / 100).toFixed(2),
  cowl: (HAIL_DEFAULT_FRANCE.cowl / 100).toFixed(2),
  door: (HAIL_DEFAULT_FRANCE.door / 100).toFixed(2),
  fender: (HAIL_DEFAULT_FRANCE.fender / 100).toFixed(2),
  quarter: (HAIL_DEFAULT_FRANCE.quarter / 100).toFixed(2),
  hood: (HAIL_DEFAULT_FRANCE.hood / 100).toFixed(2),
  windScreenFrame: (HAIL_DEFAULT_FRANCE.windScreenFrame / 100).toFixed(2),
  roof: (HAIL_DEFAULT_FRANCE.roof / 100).toFixed(2),
  rail: (HAIL_DEFAULT_FRANCE.rail / 100).toFixed(2),
  trunk: (HAIL_DEFAULT_FRANCE.trunk / 100).toFixed(2),
  rocker: (HAIL_DEFAULT_FRANCE.rocker / 100).toFixed(2),
  franceHailData: HAIL_DEFAULT_FRANCE.franceHailData?.map(
    ({ min, max, unitsTime }) => ({
      min,
      max,
      unitsTime: (unitsTime / 100).toFixed(2),
    }),
  ),
};
