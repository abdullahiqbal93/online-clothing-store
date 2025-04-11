import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "@/lib/axios/axiosBaseQuery";

export const usersApi = createApi({
  reducerPath: "usersServices",
  tagTypes: ["Users", "User"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: `/user`,
      }),
      keepUnusedDataFor: 3600,
      providesTags: [{ type: "Users", id: "LIST" }],
      transformResponse: (response) => response.data,
    }),

    getUserById: builder.query({
      query: ({ id }) => ({
        url: `/user/${id}`,
      }),
      keepUnusedDataFor: 3600,
      providesTags: (result, error, { id }) => [{ type: "User", id }],
      transformResponse: (response) => response.data,
    }),

    createUser: builder.mutation({
      query: (args) => ({
        url: "/user",
        method: "post",
        data: args,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...args }) => ({
        url: `/user/${id}`,
        method: "put",
        data: args,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/user/${id}`,
        method: "delete",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id: "LIST" },
        { type: "User", id },
      ],
    }),

    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "post",
        data: credentials,
      }),
    }),
    
    requestPasswordReset: builder.mutation({
      query: (email) => ({
        url: "/forgot-password",
        method: "post",
        data: { email },
      }),
    }),

    validateResetToken: builder.mutation({
      query: (token) => ({
        url: "/validate-reset-token",
        method: "post",
        data: { token },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: "/reset-password",
        method: "post",
        data: { token, password },
      }),
    }),

  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useCreateUserMutation,
  useLoginUserMutation,
  useRequestPasswordResetMutation,
  useValidateResetTokenMutation,
  useResetPasswordMutation,
} = usersApi;

export default usersApi.reducer;