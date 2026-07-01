import axiosInstance from "../axiosInstance";

export const postAuthLogout = async () => {
  try {
    const { data } = await axiosInstance.post("/auth/logout");

    window.localStorage.removeItem("isUserLogged");

    return data;
  } catch (err) {
    throw err;
  }
};
