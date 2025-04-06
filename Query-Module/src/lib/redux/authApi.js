import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/lib/firebase/firebase-client";
import { signOut } from "firebase/auth";
import { baseQueryWithAuth } from "./api";


export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithAuth,

  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/auth/user", 
      providesTags: ["Auth"],
    }),

    logoutUser: builder.mutation({
      queryFn: async () => {
        try {
          await signOut(auth);
          return { data: null };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: ["Auth"], 
    }),
  }),
});

export const { useGetUserQuery, useLogoutUserMutation } = authApi;
