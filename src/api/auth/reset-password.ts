import axiosInstance from "../axiosInstance";

export const postAuthResetPassword = async (formData: {
  password: string;
  token: string;
}) => {
  try {
    const { data } = await axiosInstance.post("/auth/reset-password", formData);

    return data;
  } catch (err) {
    throw err;
  }
};
