import * as Yup from "yup";

export const RegisterSchema = Yup.object({
  firstName: Yup.string().min(2, "Minimum 2 znaki").required("Imię jest wymagane"),
  lastName: Yup.string().min(2, "Minimum 2 znaki").required("Nazwisko jest wymagane"),
  email: Yup.string().email("Nieprawidłowy adres e-mail").required("E-mail jest wymagany"),
  password: Yup.string().min(8, "Hasło musi mieć co najmniej 8 znaków").required("Hasło jest wymagane"),
  marketingOptIn: Yup.boolean(),
});
