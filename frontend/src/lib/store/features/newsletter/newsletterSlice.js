import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'sonner';

const initialState = {
  subscribers: [],
  loading: false,
  sending: false,
  result: null,
  error: null
};

export const fetchSubscribers = createAsyncThunk(
  'newsletter/fetchSubscribers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/newsletter/subscribers`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscribers');
    }
  }
);

export const unsubscribeEmail = createAsyncThunk(
  'newsletter/unsubscribe',
  async (email, { rejectWithValue, dispatch }) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/newsletter/unsubscribe`, { email });
      toast.success('Successfully unsubscribed');
      dispatch(fetchSubscribers());
      return email;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unsubscribe');
    }
  }
);

export const sendNewsletter = createAsyncThunk(
  'newsletter/send',
  async ({ subject, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/newsletter/send`,
        { subject, content }
      );
      toast.success('Newsletter sent successfully!');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send newsletter');
    }
  }
);

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState,
  reducers: {
    clearResult: (state) => {
      state.result = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribers = action.payload;
      })
      .addCase(fetchSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(sendNewsletter.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendNewsletter.fulfilled, (state, action) => {
        state.sending = false;
        state.result = action.payload;
      })
      .addCase(sendNewsletter.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  }
});

export const { clearResult, clearError } = newsletterSlice.actions;
export default newsletterSlice.reducer;