import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    addressList: [],
};

export const addNewAddress = createAsyncThunk("/addresses/addNewAddress",
    async (formData) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/address`,
            formData
        );

        return response.data;
    }
);

export const fetchAllUserAddresses = createAsyncThunk("/addresses/fetchAllUserAddresses",
    async (userId) => {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/address?userId=${userId}`
        );

        return response.data;
    }
);

export const editAddress = createAsyncThunk("/addresses/editAddress",
    async ({ userId, addressId, formData }) => {
        const response = await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/address/${userId}/${addressId}`,
            formData
        );

        return response.data;
    }
);

export const deleteAddress = createAsyncThunk("/addresses/deleteAddress",
    async ({ userId, addressId }) => {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/address/${userId}/${addressId}`
        );

        return response.data;
    }
);

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addNewAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addNewAddress.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(addNewAddress.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchAllUserAddresses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllUserAddresses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addressList = action.payload.data;
            })
            .addCase(fetchAllUserAddresses.rejected, (state) => {
                state.isLoading = false;
                state.addressList = [];
            });
    },
});

export default addressSlice.reducer;
