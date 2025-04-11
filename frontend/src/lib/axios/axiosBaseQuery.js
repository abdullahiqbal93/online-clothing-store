import axios from "axios";
import { getJWTToken } from "./axios";

const getRequestConfig = (args) => {
  if (typeof args === "string") {
    return { url: args };
  }
  return args;
};

const _axios = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
});

const axiosBaseQuery = ({ transformResponse } = {}) => {
  return async (args, api, extraOptions) => {
    try {
      const requestConfig = getRequestConfig(args);

      const tokenValue = getJWTToken(); 

      const result = await _axios({
        ...requestConfig,
        headers: {
          Authorization: tokenValue ? `Bearer ${tokenValue}` : "",
          ...requestConfig.headers,
        },
        signal: api.signal,
        ...extraOptions,
      });
      
      return {
        data: transformResponse ? transformResponse(result.data) : result.data,
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          return { error: err.response?.data?.data?.message || err.response?.data?.message || err.response?.data || err.message};
        } else if (err.request) {
          return { error: 'No response from server' };
        } else {
          return { error: err.message };
        }
      } else {
        return { error: err?.message || "Unknown error" };
      }
    }
  };
};

export default axiosBaseQuery;
