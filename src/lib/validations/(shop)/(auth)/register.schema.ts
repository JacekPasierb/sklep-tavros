import * as Yup from "yup";

export const RegisterSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "Must be at least 2 characters")
    .required("First name is required"),

  lastName: Yup.string()
    .min(2, "Must be at least 2 characters")
    .required("Last name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  marketingOptIn: Yup.boolean(),
});
