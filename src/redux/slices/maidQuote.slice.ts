import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MaidQuote } from '@/libs/types/maidQuote';

interface AppState {
  maidQuote: MaidQuote;
  promoCodeError: { message: string } | null;
}

const initialState: AppState = {
  maidQuote: {} as MaidQuote,
  promoCodeError: null,
};

const appSlice = createSlice({
  name: 'maidQuote',
  initialState,
  reducers: {
    updateMaidQuote(state, action: PayloadAction<Partial<MaidQuote>>) {
      state.maidQuote = { ...state.maidQuote, ...action.payload };
    },
    clearMaidQuote(state) {
      state.maidQuote = {} as MaidQuote;
    },
    // setPromoCodeError(
    //   state,
    //   action: PayloadAction<{ message: string } | null>,
    // ) {
    //   state.promoCodeError = action.payload;
    // },
  },
});

export const { updateMaidQuote, clearMaidQuote } = appSlice.actions;

// export const useAddNamedDriverInfo = () => {
//   return useSelector(
//     (state: { quote: AppState }) =>
//       state.quote.quote?.data?.add_named_driver_info,
//   );
// };

export default appSlice.reducer;
