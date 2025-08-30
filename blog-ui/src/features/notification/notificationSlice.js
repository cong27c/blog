import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
  },
  reducers: {
    setNotifications: (state, action) => {
      state.list = action.payload;
    },
    addNotification: (state, action) => {
      const exists = state.list.find((n) => n.id === action.payload.id);
      if (!exists) state.list.unshift(action.payload);
    },
    markAsReadSlice: (state, action) => {
      const id = action.payload;
      const noti = state.list.find((n) => n.id === id);
      if (noti) {
        noti.read = true;
      }
    },
    markAllAsReadSlice: (state) => {
      state.list.forEach((n) => (n.read = true));
    },
    clearNotifications: (state) => {
      state.list = [];
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsReadSlice,
  markAllAsReadSlice,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
