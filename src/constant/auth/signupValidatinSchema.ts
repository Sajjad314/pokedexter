import { object, string } from "yup";

export const signUpValidationSchema = object({
  name: string().required("Required!").min(6, "Min 6 Character Needed"),
  email: string().required("Required!").email("Email must be a valid email"),
  phone: string().required("Phone number is required"),
  password: string().required("Required!").min(6, "Min 6 Character Needed"),
});