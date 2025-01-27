import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Board {
    id: number;
    name: string;
    boardCreatorId: number;
    createdAt?: string;
    estimatedEndDate?: string;
}

interface BoardsState {
    boards: Board[];
}

const initialState: BoardsState = {
    boards: [],
};

const boardsSlice = createSlice({
    name: 'boards',
    initialState,
    reducers: {
        setBoards: (state, action: PayloadAction<Board[]>) => {
            state.boards = action.payload;
        },
    },
});

export const { setBoards } = boardsSlice.actions;
export default boardsSlice.reducer;