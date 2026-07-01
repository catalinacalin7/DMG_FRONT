import * as yup from "yup";
export const rAndIMatrixSchema = yup.object().shape({
  // name: yup.string().required("Matrix name should be unique."),
  hood: yup
    .number()
    .typeError("Value must be a digit")
    .required("Field is required"),
  leftFrontFender: yup
    .number()
    .typeError("Value must be a digit")
    .required("Field is required"),
  rightFrontFender: yup
    .number()
    .typeError("Value must be a digit")
    .required("Field is required"),
  leftFrontDoor: yup
    .number()
    .typeError("Value must be a digit")
    .required("Field is required"),
  rightFrontDoor: yup
    .number()
    .typeError("Value must be a digit")
    .required("Field is required"),
  leftRearDoor: yup
    .number()
    .typeError("Value must be a digit")
    .required("Field is required"),
  rightRearDoor: yup
    .number()
    .typeError("Value must be a digit")
    .required("Field is required"),
  roof: yup
    .number()
    .typeError("Value must be a digit")
    .required("Field is required"),
  leftRail: yup
    .number()
    .typeError("Value must be a digit")
    .required("Field is required"),
  rightRail: yup
    .number()
    .typeError("Value must be a digit")
    .required("Field is required"),
  leftQuarter: yup
    .number()
    .typeError("Value must be a digit")
    .required("Field is required"),
  rightQuarter: yup
    .number()
    .typeError("Value must be a digit")
    .required("Field is required"),
  trunkUp: yup
    .number()
    .typeError("Value must be a digit")
    .required("Field is required"),
  trunkDown: yup
    .number()
    .typeError("Value must be a digit")
    .required("Field is required"),
  leftRocker: yup
    .number()
    .typeError("Value must be a digit")
    .required("Field is required"),
  rightRocker: yup
    .number()
    .typeError("Value must be a digit")
    .required("Field is required"),
});

export type RandIMatrixSchema = yup.InferType<typeof rAndIMatrixSchema>;
