import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './boardsSlice';

const store = configureStore({
    reducer: {
        boards: boardsReducer,
    },
});

export default store;