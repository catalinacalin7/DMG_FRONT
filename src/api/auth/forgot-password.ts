import axiosInstance from "../axiosInstance";


export const postAuthForgotPassword = async (formData: { email: string }) => {
  try {
    const { data } = await axiosInstance.post(
      "/auth/forgot-password",
      formData,
    );

    return data;
  } catch (err) {
    throw err;
  }
};
