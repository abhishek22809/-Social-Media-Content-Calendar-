import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    selectedDates: [],
    assignedPosts: [], // NEW STATE
};

const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        setPosts: (state, action) => {
            let posts = action.payload;
            posts.sort((a, b) => b.followerCount - a.followerCount);
            state.posts = posts;
        },
        setSelectedDates: (state, action) => {
            state.selectedDates = action.payload;
        },
        setAssignedPosts: (state, action) => { // NEW REDUCER
            state.assignedPosts = action.payload;
        },
    },
});

export const { setPosts, setSelectedDates, setAssignedPosts } = calendarSlice.actions;
export default calendarSlice.reducer;
