import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// --- TypeScript Interfaces ---

export interface AdminStatsResponse {
    success: boolean;
    stats: {
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    };
}

export interface RatedUser {
    ratingId: string | number;
    rating: number;
    user: {
        id: string | number;
        name: string;
        email: string;
        address: string;
    };
}

export interface StoreDetail {
    id: string | number;
    name: string;
    email: string;
    address: string;
    averageRating: number;
    totalRatings: number;
    ratedByUsers: RatedUser[];
}

export interface StoreOwnerDashboardResponse {
    success: boolean;
    stores: StoreDetail[];
}

// --- RTK Query Definition ---

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:5000/api', // Adjust to match your backend URL or env variable
        prepareHeaders: (headers) => {
            // Automatically attach Bearer token from localStorage
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['AdminDashboard', 'StoreDashboard'],
    endpoints: (builder) => ({
        // Endpoint for System Administrator Dashboard Stats
        getAdminDashboardStats: builder.query<AdminStatsResponse, void>({
            query: () => '/admin/admin', // Replace with your exact backend route path
            providesTags: ['AdminDashboard'],
        }),

        // Endpoint for Store Owner Dashboard Data
        getStoreOwnerDashboard: builder.query<StoreOwnerDashboardResponse, void>({
            query: () => '/admin/store-owner', // Replace with your exact backend route path
            providesTags: ['StoreDashboard'],
        }),
    }),
});

// Export auto-generated hooks for usage in functional components
export const { 
    useGetAdminDashboardStatsQuery, 
    useGetStoreOwnerDashboardQuery 
} = dashboardApi;