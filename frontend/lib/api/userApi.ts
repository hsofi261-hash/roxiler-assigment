import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { dashboardApi } from './dashboardApi';

// --- TypeScript Interfaces ---

export interface RatingModel {
    id: number | string;
    rating: number;
    comment?: string;
    createdAt?: string;
}

export interface StoreModel {
    id: number | string;
    name: string;
    email: string;
    address: string;
    ratings?: RatingModel[];
}

export interface UserModel {
    id: number | string;
    name: string;
    email: string;
    address: string;
    role: string;
    stores?: StoreModel[];
    createdAt?: string;
    updatedAt?: string;
}

export interface GetUsersQueryParams {
    name?: string;
    email?: string;
    address?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export interface GetUsersResponse {
    success: boolean;
    count: number;
    users: UserModel[];
}

export interface GetUserByIdResponse {
    success: boolean;
    user: UserModel;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    address: string;
    role?: string;
}

export interface CreateUserResponse {
    message: string;
    user: Omit<UserModel, 'stores'>;
}

// --- RTK Query Slice Addition ---

export const userApi = createApi({
    reducerPath: 'userApi',
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
    tagTypes: ['AdminDashboard', 'AdminUsers', 'AdminStores'],
    endpoints: (builder) => ({
        // 1. Get all users with optional filters and sorting parameters
        getUsers: builder.query<GetUsersResponse, GetUsersQueryParams | void>({
            query: (params) => {
                const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
                return `/users${queryString ? `?${queryString}` : ''}`;
            },
            providesTags: ['AdminUsers'],
        }),

        // 2. Get a single user by ID
        getUserById: builder.query<GetUserByIdResponse, string | number>({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'AdminUsers', id }],
        }),

        // 3. Create a new user by Admin
        createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
            query: (newUserData) => ({
                url: '/users',
                method: 'POST',
                body: newUserData,
            }),
            invalidatesTags: ['AdminUsers', 'AdminDashboard'],
        }),
    }),
});

// Export auto-generated hooks for components
export const { 
    useGetUsersQuery,
    useLazyGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation 
} = userApi;