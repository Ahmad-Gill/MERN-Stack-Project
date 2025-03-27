import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "Muhammad Ahmad",
    email: "m.ahmadgill01@gmail.com",
    isActive: true,
    isCustomer: true,
    isProvider: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setActiveStatus: (state, action) => {
            state.isActive = action.payload;
        },
        setCustomerStatus: (state, action) => {
            state.isCustomer = action.payload;
        },
        setProviderStatus: (state, action) => {
            state.isProvider = action.payload;
        },
        resetUser: () => initialState,
    },
});

export const { setName, setEmail, setActiveStatus, setCustomerStatus, setProviderStatus, resetUser } = userSlice.actions;

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
    },
});
