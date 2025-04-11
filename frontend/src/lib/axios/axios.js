import axios from "axios";

export function getJWTToken() {
  const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
  return token ? token.split('=')[1] : null;
}

export const getAxios = (token) => {
  return () => {
    return axios.create({
      baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
};

export async function getAxiosWithToken() {
  const token = getJWTToken();
  if (!token) {
    throw new Error("Token not found");
  }
  return getAxios(token)();
}
