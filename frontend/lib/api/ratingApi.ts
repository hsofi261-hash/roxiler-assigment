import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// --- TypeScript Interfaces ---

export interface RatingModel {
    id: number | string;
    rating: number;
    userId: number | string;
    storeId: number | string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SubmitRatingRequest {
    storeId: number | string;
    rating: number;
}

export interface SubmitRatingResponse {
    message: string;
    rating: RatingModel;
}

export interface UpdateRatingRequest {
    id: number | string;
    rating: number;
}

export interface UpdateRatingResponse {
    message: string;
    rating: RatingModel;
}

// --- RTK Query Slice ---

export const ratingApi = createApi({
    reducerPath: 'ratingApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:5000/api', // Adjust to match your backend URL or env variable
        prepareHeaders: (headers) => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['AdminStores', 'AdminDashboard', 'Ratings'],
    endpoints: (builder) => ({
        // 1. Submit a new rating for a store (POST /ratings)
        submitRating: builder.mutation<SubmitRatingResponse, SubmitRatingRequest>({
            query: (ratingData) => ({
                url: '/ratings',
                method: 'POST',
                body: ratingData,
            }),
            invalidatesTags: ['AdminStores', 'AdminDashboard', 'Ratings'],
        }),

        // 2. Update an existing rating by ID (PUT /ratings/:id)
        updateRating: builder.mutation<UpdateRatingResponse, UpdateRatingRequest>({
            query: ({ id, rating }) => ({
                url: `/ratings/${id}`,
                method: 'PUT',
                body: { rating },
            }),
            invalidatesTags: ['AdminStores', 'AdminDashboard', 'Ratings'],
        }),
    }),
});

// Export auto-generated hooks for components
export const { 
    useSubmitRatingMutation, 
    useUpdateRatingMutation 
} = ratingApi;