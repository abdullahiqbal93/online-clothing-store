import { getAxiosWithToken } from "@/lib/axios/axios";

export const create = async (req, path) => {
  try {
    const axios = await getAxiosWithToken();
    const data = await req.json();
    const resp = await axios.post(path, data);
    return resp.data;
  } catch (err) {
    const error = err;
    return {
      data: error.response?.data,
      status: error.response?.status,
    };
  }
};

export const getAll = async (_, path) => {
  try {
    const axios = await getAxiosWithToken();
    const resp = await axios.get(path);
    return resp.data;
  } catch (err) {
    const error = err;
    return {
      data: error.response?.data,
      status: error.response?.status,
    };
  }
};

export const getById = async (id, path) => {
  try {
    const axios = await getAxiosWithToken();
    const resp = await axios.get(`${path}/${id}`);
    return resp.data;
  } catch (err) {
    const error = err;
    return {
      data: error.response?.data,
      status: error.response?.status,
    };
  }
};

export const putById = async (req, id, path) => {
  try {
    const axios = await getAxiosWithToken();
    const data = await req.json();
    const resp = await axios.put(`${path}/${id}`, data);
    return resp.data;
  } catch (err) {
    const error = err;
    return {
      data: error.response?.data,
      status: error.response?.status,
    };
  }
};

export const deleteByID = async (id, path) => {
  try {
    const axios = await getAxiosWithToken();
    const resp = await axios.delete(`${path}/${id}`);
    return resp.data;
  } catch (err) {
    const error = err;
    return {
      data: error.response?.data,
      status: error.response?.status,
    };
  }
};
