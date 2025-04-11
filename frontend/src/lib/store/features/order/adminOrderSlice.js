import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
  isLoading: false,
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/order`);
    const orders = response.data.data;

    const ordersWithUsers = await Promise.all(
      orders.map(async (order) => {
        try {
          const userResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/user/${order.userId}`,
            { withCredentials: true }
          );
          return {
            ...order,
            user: userResponse.data.data
          };
        } catch (error) {
          return {
            ...order,
            user: null
          };
        }
      })
    );

    return { data: ordersWithUsers };
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id) => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/order/${id}`);
    return response.data;
  }
);

export const deleteOrder = createAsyncThunk(
  "/order/deleteOrder",
  async (id) => {
    const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/order/${id}`);
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/order/${id}`,
      { orderStatus }
    );
    return response.data;
  }
);

export const deleteOrderForAdmin = createAsyncThunk(
  '/order/deleteOrderForAdmin',
  async (id) => {
    const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/order/admin-delete/${id}`);
    return response.data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(deleteOrderForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrderForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload.order;
        const index = state.orderList.findIndex((o) => o._id === updatedOrder?._id);
        if (index !== -1) {
          state.orderList[index] = updatedOrder; 
        }
      })
      .addCase(deleteOrderForAdmin.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload.data;
        const index = state.orderList.findIndex((o) => o._id === updatedOrder?._id);
        if (index !== -1) {
          state.orderList[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = state.orderList.filter(order => order?._id !== action.payload.order?._id);
      })
      .addCase(deleteOrder.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;