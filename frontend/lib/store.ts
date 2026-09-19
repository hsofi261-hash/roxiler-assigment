import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './api/authApi'
import { dashboardApi } from './api/dashboardApi';
import { userApi } from './api/userApi';
import { storeApi } from './api/storeApi';  

export const makeStore = () => {
  return configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [storeApi.reducerPath]: storeApi.reducer,
    },
    middleware: (getDefaultMiddleware: any) => getDefaultMiddleware()
    .concat(authApi.middleware)
    .concat(dashboardApi.middleware)
    .concat(userApi.middleware)
    .concat(storeApi.middleware),
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']