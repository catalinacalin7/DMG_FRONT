import * as yup from "yup";


export const franceRemoveInstallSchema = yup.object().shape({
  categoryA: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),
  categoryB: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),
  categoryC: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),
  categoryD: yup
    .string()
    .required("This field is required.")
    .matches(
      /^\d+\.\d{2}$/,
      "Must be a number with two decimals.",
    ),

});

export type FranceRemoveInstallSchema = yup.InferType<typeof franceRemoveInstallSchema>;

