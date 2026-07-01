import { LoginFormData } from "@/types/auth";
import axios from "axios";

const axiosLogin = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});


export const postAuthLogin = async (formData: LoginFormData) => {
  try {
    const { data } = await axiosLogin.post("/auth/login", formData);

    window.localStorage.setItem("isUserLogged", "true");

    return data;
  } catch (err) {
    throw err;
  }
};
