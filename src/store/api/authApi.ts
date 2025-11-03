import {
  AuthResponse,
  LoginRequest,
  ProfileResponse,
  RegisterRequest,
} from "@/types/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ["Admin"],
  endpoints: (builder) => ({
    // Get admin profile
    getAdminProfile: builder.query<ProfileResponse, string>({
      query: (adminId: string) => `/admin/profile/${adminId}`,
      providesTags: (result, error, adminId) =>
        result?.success ? [{ type: "Admin" as const, id: adminId }] : ["Admin"],
    }),

    // Register admin
    registerAdmin: builder.mutation<AuthResponse, RegisterRequest>({
      query: (adminData: RegisterRequest) => ({
        url: "/admin/register",
        method: "POST",
        body: adminData,
      }),
      invalidatesTags: ["Admin"],
    }),

    // Login admin
    loginAdmin: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials: LoginRequest) => ({
        url: "/admin/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAdminProfileQuery,
  useRegisterAdminMutation,
  useLoginAdminMutation,
} = authApi;
