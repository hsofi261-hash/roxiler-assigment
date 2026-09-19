import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types for request and response payloads
export interface User {
    id: string | number;
    name: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
    address: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UpdatePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface CheckAuthResponse {
    isAuthenticated: boolean;
    user: User;
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:5000/api', // Replace with your actual backend URL or environment variable
        prepareHeaders: (headers, { getState }) => {
            // Attach token automatically from localStorage if available
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        signup: builder.mutation<AuthResponse, SignupRequest>({
            query: (userData) => ({
                url: '/auth/signup',
                method: 'POST',
                body: userData,
            }),
        }),
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        updatePassword: builder.mutation<{ message: string }, UpdatePasswordRequest>({
            query: (passwords) => ({
                url: '/auth/update-password',
                method: 'PUT',
                body: passwords,
            }),
        }),
        checkAuth: builder.query<CheckAuthResponse, void>({
            query: () => '/auth/check-user',
            providesTags: ['Auth'],
        }),
        checkStoreAuth: builder.query<CheckAuthResponse, void>({
            query: () => '/auth/check-store',
            providesTags: ['Auth'],
        }),
        checkAdminAuth: builder.query<CheckAuthResponse, void>({
            query: () => '/auth/check-admin',
            providesTags: ['Auth'],
        }),
    }),
});

// Export all hooks for usage in functional components
export const { 
    useSignupMutation, 
    useLoginMutation, 
    useUpdatePasswordMutation, 
    useCheckAuthQuery,
    useLazyCheckAuthQuery,
    useCheckStoreAuthQuery,
    useLazyCheckStoreAuthQuery,
    useCheckAdminAuthQuery,
    useLazyCheckAdminAuthQuery
} = authApi;