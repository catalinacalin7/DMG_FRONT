import * as yup from "yup";

export const hailMatrixSchema = yup.object().shape({
  // name: yup.string().required("Matrix name is required and must be unique."),
  rate: yup.string().required("Rate should be an integer number"),
  matrixData: yup
    .array()
    .of(
      yup.object().shape({
        unit: yup.string().required("This field is required."),
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
      }),
    )
    .required("Matrix unit data is required"),
});

export type HailMatrixSchema = yup.InferType<typeof hailMatrixSchema>;
