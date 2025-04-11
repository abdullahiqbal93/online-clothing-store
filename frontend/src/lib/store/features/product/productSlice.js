import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  error: null,
  productList: [],
  productDetails: null,
  brands: [],
  reviewsByProduct: {},
  averageRatings: {},
};

export const addNewProduct = createAsyncThunk(
  "/product/addnewproduct",
  async (formData) => {
    const result = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/product`,
      formData
    );
    return result?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/product/fetchAllProducts",
  async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/product`
    );

    return result?.data;
  }
);

export const fetchProductById = createAsyncThunk(
  "/product/fetchProductById",
  async (productId) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/product/${productId}`
    );

    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/product/editProduct",
  async ({ id, formData }) => {
    const result = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/product/${id}`,
      formData,
    );

    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/product/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/product/${id}`
    );

    return result?.data;
  }
);

export const fetchAllFilteredProducts = createAsyncThunk("/product/fetchAllFilteredProducts", async ({ filterParams, sortParams }) => {

  const query = new URLSearchParams({
    ...filterParams,
    sortBy: sortParams,
  });

  const result = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/filtered-products?${query}`
  );

  return result?.data;
}
);

export const fetchProductDetails = createAsyncThunk("/product/fetchProductDetails", async (id) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/product/${id}`
  );

  return result?.data;
}
);

export const fetchAllBrands = createAsyncThunk("/product/fetchBrands", async () => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/product/brand`
  );

  return result?.data;
}
);

export const addReview = createAsyncThunk(
  "/product/addReview",
  async ({ productId, formdata }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/product/${productId}/review`,
        formdata,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return error.response?.data || { message: "Failed to add review" };
    }
  }
);

export const updateReview = createAsyncThunk(
  "/product/updateReview",
  async ({ productId, reviewId, formdata }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/product/${productId}/review/${reviewId}`,
        formdata,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return error.response?.data || { message: "Failed to update review" };
    }
  }
);

export const deleteReview = createAsyncThunk(
  "/product/deleteReview",
  async ({ productId, reviewId, userId }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/product/${productId}/review/${reviewId}`,
        { 
          data: { userId },
          withCredentials: true 
        }
      );
      return { ...response.data, productId, reviewId };
    } catch (error) {
      return error.response?.data || { message: "Failed to delete review" };
    }
  }
);

const updateAverageRating = (state, productId) => {
  const product = state.productDetails;
  if (!product || !product.reviews) return;
  
  const totalRating = product.reviews.reduce((sum, review) => sum + review.reviewValue, 0);
  product.averageRating = product.reviews.length ? totalRating / product.reviews.length : 0;
};

const productSlice = createSlice({
  name: 'productSlice',
  initialState,
  reducers: {
    resetProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
        updateAverageRating(state, action.payload.data._id);
      })
      .addCase(fetchProductById.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.productDetails = action.payload.data;
          updateAverageRating(state, action.payload.data._id);
        }
      })
      .addCase(addReview.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.productDetails = action.payload.data;
          updateAverageRating(state, action.payload.data._id);
        }
      })
      .addCase(updateReview.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          if (state.productDetails) {
            state.productDetails.reviews = state.productDetails.reviews.filter(
              (review) => review._id !== action.payload.reviewId
            );
            updateAverageRating(state, action.payload.productId);
          }
        }
      })
      .addCase(deleteReview.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetProductDetails } = productSlice.actions;

export default productSlice.reducer;