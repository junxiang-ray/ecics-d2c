import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInfoState {
  userInfoCar: Record<string, any>;
}

const initialState: UserInfoState = {
  userInfoCar: {},
};

const appSlice = createSlice({
  name: 'userInfoCar',
  initialState,
  reducers: {
    setUserInfoCar(state, action: PayloadAction<Record<string, any>>) {
      state.userInfoCar = action.payload;
    },
    clearUserInfoCar(state) {
      state.userInfoCar = {};
    },
  },
});

export const { setUserInfoCar, clearUserInfoCar } = appSlice.actions;
export default appSlice.reducer;
