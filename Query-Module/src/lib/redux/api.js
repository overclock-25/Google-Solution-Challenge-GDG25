import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/lib/firebase/firebase-client";
import { onAuthStateChanged } from "firebase/auth";

export const baseQueryWithAuth = async (args, api, extraOptions) => {
  const token = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        resolve(idToken);
      } else {
        resolve(null);
      }
      unsubscribe();
    });

    setTimeout(() => {
      unsubscribe();
      resolve(null);
    }, 3000);
  });

  const baseQuery = fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      const date = new Date().toLocaleDateString("en-GB");
      headers.set("x-date", date);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  return baseQuery(args, api, extraOptions);
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,

  tagTypes: ["Farm", "Farms", "Crops", "Interaction", "Alert"],
  endpoints: (builder) => ({
    addFarm: builder.mutation({
      query: (farmData) => ({
        url: "/farms",
        method: "POST",
        body: farmData,
      }),
      invalidatesTags: ["Farm", "Farms", "Interaction"],
    }),

    getFarms: builder.query({
      query: () => "/farms",
      transformResponse: (response) => response.farms,
      providesTags: ["Farms"],
    }),

    getCrops: builder.query({
      query: (farmId) => ({
        url: "/crop-suggestion",
        headers: {
          "x-farm-id": farmId,
        },
      }),
      providesTags: ["Crops"],
    }),

    getFarmById: builder.query({
      query: (farmId) => `/farms/${farmId}`,
      providesTags: (result, error, farmId) => [{ type: "Farm", id: farmId }],
    }),

    getFarmAlerts: builder.query({
      query: (farmId) => ({
        url: "/notifications",
        headers: {
          "x-farm-id": farmId,
        },
      }),
      providesTags: (result, error, farmId) => [{ type: "Alert", id: farmId }],
    }),

    startHarvest: builder.mutation({
      query: ({ farmId, cropName }) => ({
        url: `/start-harvest?cropName=${cropName}`,
        method: "POST",
        headers: {
          "x-farm-id": farmId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cropName),
      }),
      invalidatesTags: (result, error, { farmId }) => [
        { type: "Farm", id: farmId },
      ],
    }),

    healthReport: builder.mutation({
      query: ({ farmId, formData }) => ({
        url: `/health-report`,
        method: "POST",
        headers: {
          "x-farm-id": farmId,
        },
        body: formData,
      }),
      invalidatesTags: (result, error, { farmId }) => [
        { type: "Farm", id: farmId },
      ],
    }),

    queryResponse: builder.mutation({
      query: ({ farmId, formData, type }) => ({
        url: `/query?type=${type}`,
        method: "POST",
        headers: {
          "x-farm-id": farmId,
        },
        body: formData,
      }),
      invalidatesTags: (result, error, { farmId }) => [
        { type: "Farm", id: farmId },
      ],
    }),

    updateNotification: builder.mutation({
      query: ({ farmId, enabled }) => ({
        url: "/notifications/enable",
        method: "PATCH",
        headers: {
          "x-farm-id": farmId,
        },
        body: JSON.stringify({ notification: enabled }),
      }),
      invalidatesTags: (result, error, { farmId }) => [
        { type: "Farm", id: farmId },
        "Farms",
      ],
    }),
  }),
});

export const {
  useAddFarmMutation,
  useGetFarmsQuery,
  useGetFarmByIdQuery,
  useStartHarvestMutation,
  useHealthReportMutation,
  useQueryResponseMutation,
  useGetCropsQuery,
  useUpdateNotificationMutation,
  useGetFarmAlertsQuery
} = api;
