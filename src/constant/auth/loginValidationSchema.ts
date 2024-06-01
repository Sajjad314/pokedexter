import { object, string } from "yup";

export const loginValidationSchema = object({
  email: string().required("Required!").email("Email must be a valid email"),
  password: string().required("Required!"),
});