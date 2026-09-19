import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// --- TypeScript Interfaces ---

export interface OwnerModel {
    id: number | string;
    name: string;
    email: string;
}

export interface RatingDetailModel {
    id: number | string;
    rating: number;
    userId?: number | string;
    user?: OwnerModel;
}

export interface StoreModel {
    id: number | string;
    name: string;
    email: string;
    address: string;
    userId?: number | string | null;
    owner?: OwnerModel;
    ratings?: RatingDetailModel[];
    averageRating?: number;
    totalRatings?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface GetStoresQueryParams {
    search?: string;
    name?: string;
    address?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export interface GetStoresResponse {
    success: boolean;
    count: number;
    stores: StoreModel[];
}

export interface GetStoreByIdResponse {
    success: boolean;
    store: StoreModel;
}

export interface CreateStoreRequest {
    name: string;
    email: string;
    address: string;
    userId?: number | string | null;
}

export interface CreateStoreResponse {
    message: string;
    store: StoreModel;
}

// --- RTK Query Slice ---

export const storeApi = createApi({
    reducerPath: 'storeApi',
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
    tagTypes: ['AdminDashboard', 'AdminStores', 'AdminUsers'],
    endpoints: (builder) => ({
        // 1. Get all stores with search, filters (name, address), and sorting
        getStores: builder.query<GetStoresResponse, GetStoresQueryParams | void>({
            query: (params) => {
                const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
                return `/stores${queryString ? `?${queryString}` : ''}`;
            },
            providesTags: ['AdminStores'],
        }),

        // 2. Get a single store by ID (includes ratings and owner details)
        getStoreById: builder.query<GetStoreByIdResponse, string | number>({
            query: (id) => `/stores/${id}`,
            providesTags: (result, error, id) => [{ type: 'AdminStores', id }],
        }),

        // 3. Create a new store by Admin
        createStore: builder.mutation<CreateStoreResponse, CreateStoreRequest>({
            query: (newStoreData) => ({
                url: '/stores',
                method: 'POST',
                body: newStoreData,
            }),
            invalidatesTags: ['AdminStores', 'AdminDashboard'],
        }),
    }),
});

// Export auto-generated hooks for components
export const { 
    useGetStoresQuery,
    useLazyGetStoresQuery,
    useGetStoreByIdQuery,
    useCreateStoreMutation 
} = storeApi;