import { configureStore, createSlice } from "@reduxjs/toolkit";

// Function to load state from localStorage
const loadState = () => {
    try {
        const serializedState = localStorage.getItem("userState");
        return serializedState ? JSON.parse(serializedState) : initialState;
    } catch (error) {
        console.error("Failed to load state:", error);
        return initialState;
    }
};

// Function to save state to localStorage
const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("userState", serializedState);
    } catch (error) {
        console.error("Failed to save state:", error);
    }
};

// Function to clear state from localStorage (for Logout)
const clearState = () => {
    try {
        localStorage.removeItem("userState");
    } catch (error) {
        console.error("Failed to clear state:", error);
    }
};

// Initial State
const initialState = {
    name: "",
    email: "m.ahmadgill01@gmail.com",
    isActive: false,
    isCustomer: false,
    isProvider: true,
};

// Redux Slice
const userSlice = createSlice({
    name: "user",
    initialState: loadState(),
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
            saveState(state);
        },
        setEmail: (state, action) => {
            state.email = action.payload;
            saveState(state);
        },
        setActiveStatus: (state, action) => {
            state.isActive = action.payload;
            saveState(state);
        },
        setCustomerStatus: (state, action) => {
            state.isCustomer = action.payload;
            state.isProvider = !action.payload;
            saveState(state);
        },
        setProviderStatus: (state, action) => {
            state.isProvider = action.payload;
            state.isCustomer = !action.payload;
            saveState(state);
        },
        resetUser: () => {
            clearState(); // Clear localStorage
            return initialState; // Reset Redux store
        },
    },
});

// Export Actions
export const { setName, setEmail, setActiveStatus, setCustomerStatus, setProviderStatus, resetUser } = userSlice.actions;

// Configure Store
export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
    },
});

// Save state on every change
store.subscribe(() => {
    saveState(store.getState().user);
});
