import * as yup from "yup";

export const signInSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const signUpSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .test(
      "no-email-prefix",
      "Password cannot contain part of your email address",
      function (value) {
        const emailPrefix = this.parent.email?.split("@")[0];

        return emailPrefix
          ? !value.toLowerCase().includes(emailPrefix.toLowerCase())
          : true;
      },
    )
    .matches(
      /[0-9!@#$%^&*()_+=\-{}\[\]:;\"'<>,.?/~`|\\]/,
      "Password must contain at least one number or symbol",
    ),
});

export const restPasswordEmailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

export const newPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /[0-9!@#$%^&*()_+=\-{}\[\]:;\"'<>,.?/~`|\\]/,
      "Password must contain at least one number or symbol",
    ),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});
