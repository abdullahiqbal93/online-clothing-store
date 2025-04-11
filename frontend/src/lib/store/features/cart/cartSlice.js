import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { logoutUser } from "../user/userSlice";

const initialState = {
  cartItems: [],
  isLoading: false,
};

export const addToCart = createAsyncThunk("cart/addToCart", async ({ userId, productId, quantity, size, color }) => {
  const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/cart`, { userId, productId, quantity, size, color });
  return response.data;
});

export const fetchUserCartItems = createAsyncThunk("cart/fetchUserCartItems", async (userId) => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/cart/${userId}`);
  return response.data;
});

export const updateCartItemQuantity = createAsyncThunk("cart/updateCartItemQuantity", async ({ userId, productId, size, color, quantity }) => {
  const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/cart`, { userId, productId, size, color, quantity });
  return response.data;
});

export const deleteCartItem = createAsyncThunk("cart/deleteCartItem", async ({ userId, productId, size, color }) => {
  const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/cart`, {
    data: { userId, productId, size, color },
  });
  return response.data;
});

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetchUserCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchUserCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartItemQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.cartItems = [];
        state.isLoading = false;
      });
  },
});

export default cartSlice.reducer;