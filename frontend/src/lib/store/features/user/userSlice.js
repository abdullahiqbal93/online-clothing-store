import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user`,
        formData,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return error.response?.data || { message: "Something went wrong" };
    }

  }
);

export const fetchUserById = createAsyncThunk(
  "/user/fetchUserById",
  async (id) => {
    const result = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/${id}`, {
      withCredentials: true,
    });
    return result?.data;
  }
);



export const loginUser = createAsyncThunk(
  "/auth/login",

  async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        formData,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return error.response?.data || { message: "Something went wrong" };
    }
  }
);

export const editUser = createAsyncThunk(
  "/user/editUser",
  async ({ id, formData }) => {
    const result = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/user/${id}`,
      formData,
      {
        withCredentials: true,
      }
    );

    return result?.data;
  }
);



export const checkAuth = createAsyncThunk(
  "/auth/checkAuth",

  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/check-auth`,
      {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        }
      }
    );

    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/logout`, {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    invalidateUser: (state) => { 
      state.user = null;
      state.isAuthenticated = false;
      document.cookie = 'authToken=; Max-Age=0; path=/; secure; SameSite=Strict';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.data : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.data : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(editUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          ...state.user,
          name: action.payload.data.name,
          phoneNumber: action.payload.data.phoneNumber,
        };
        state.isAuthenticated = action.payload.success;
      })
  }
});

export const { setUser, invalidateUser } = userSlice.actions;

export default userSlice.reducer;
