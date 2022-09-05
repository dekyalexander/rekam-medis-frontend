import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  isLoading:false,
  activeMenu:{},
  applicationMenus:[],
  menuActions:[]
};

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveMenu(state, action) {
      state.activeMenu = action.payload;          
    },
    setApplicationMenus(state, action){
      state.applicationMenus = action.payload;          
    },
    setMenuActions(state, action) {
      state.menuActions = action.payload;      
    },
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { setActiveMenu, setApplicationMenus, setMenuActions } = slice.actions;
