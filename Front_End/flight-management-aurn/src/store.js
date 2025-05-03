import { configureStore, createSlice } from "@reduxjs/toolkit";

// Initial State
const initialState = {
  name: "",
  email: "",
  isActive: false,
  isCustomer: false,
  isProvider: false,
};

// Local Storage Functions
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("userState");
    return serializedState ? JSON.parse(serializedState) : initialState;
  } catch (error) {
    console.error("Failed to load state:", error);
    return initialState;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("userState", serializedState);
  } catch (error) {
    console.error("Failed to save state:", error);
  }
};

const clearState = () => {
  try {
    localStorage.removeItem("userState");
  } catch (error) {
    console.error("Failed to clear state:", error);
  }
};

// Redux Slice
const userSlice = createSlice({
  name: "user",
  initialState: loadState(),
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
      if (action.payload) state.isProvider = false;
    },
    setProviderStatus: (state, action) => {
      state.isProvider = action.payload;
      if (action.payload) state.isCustomer = false;
    },
    resetUser: () => {
      clearState();
      return initialState;
    },
  },
});

// Export Actions
export const {
  setName,
  setEmail,
  setActiveStatus,
  setCustomerStatus,
  setProviderStatus,
  resetUser,
} = userSlice.actions;

// Store Configuration
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

// Persist store changes to localStorage
store.subscribe(() => {
  saveState(store.getState().user);
});
