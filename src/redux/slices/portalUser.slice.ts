import { UserProfile } from '@/libs/types/user-profile';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  user: UserProfile | null;
  meta: Record<string, any>;
};

const initialState: UserState = {
  meta: { ignore: false },
  user: null,
};

const userSlice = createSlice({
  name: 'portalUser',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfile>) {
      state.meta = { ignore: false };
      state.user = action.payload;
    },
    updateUser(state, action: PayloadAction<Partial<UserProfile>>) {
      state.meta = { ignore: false };
      if (state.user && action.payload)
        state.user = {
          ...state.user,
          ...(Object.fromEntries(
            Object.entries(action.payload).filter(([_, v]) => v !== undefined),
          ) as Partial<UserProfile>),
        };
    },
    syncUser(state, action) {
      const payload = action.payload;
      if (state.user === payload) {
        state.meta = { ignore: null };
      } else {
        state.meta = { ignore: true };
        state.user = payload;
      }
    },
    clearUser: () => ({ ...initialState }),
  },
});

export const { setUser, updateUser, syncUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
