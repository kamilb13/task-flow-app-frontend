import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import boardsReducer from './boardsSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        boards: boardsReducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
