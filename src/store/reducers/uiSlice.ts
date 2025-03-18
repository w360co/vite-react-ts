import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isDark: boolean;
  sidebarCollapsed: boolean;
  language: string;
}

const initialState: UIState = {
  isDark: false,
  sidebarCollapsed: false,
  language: 'en',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const { toggleTheme, toggleSidebar, setLanguage } = uiSlice.actions;
export default uiSlice.reducer;