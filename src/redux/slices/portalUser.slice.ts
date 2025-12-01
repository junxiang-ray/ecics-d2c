import { UserProfile } from '@/libs/types/user-profile';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  user: UserProfile | null;
};

const initialState: UserState = {
  user: {
    name: 'John Doe',
    phone: '91234567',
    email: 'john.doe@email.com',
    gender: 'MALE',
    marital_status: 'SINGLE',
    address: {
      address_line_1: '123 Orchard Road',
      address_line_2: '#05-10 ABC Building',
      address_line_3: 'Singapore',
      postal_code: '238858',
    },
  } as UserProfile,
};

const userSlice = createSlice({
  name: 'portalUser',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload;
    },
    updateUser(state, action: PayloadAction<Partial<UserProfile>>) {
      if (action.payload) state.user = { ...state.user, ...action.payload };
    },
    clearUser: () => ({ ...initialState }),
  },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
