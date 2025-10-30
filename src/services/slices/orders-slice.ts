import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

interface OrdersState {
  currentOrder: TOrder | null;
  profileOrders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  currentOrder: null,
  profileOrders: [],
  loading: false,
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      );
    }
  }
);

const ordersSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
    },
    setProfileOrders: (state, action: PayloadAction<TOrder[]>) => {
      state.profileOrders = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.profileOrders = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const { clearOrder, setProfileOrders } = ordersSlice.actions;
export default ordersSlice.reducer;

// Селекторы для order
export const currentOrderSelector = (state: RootState) =>
  state.order.currentOrder;

export const orderLoadingSelector = (state: RootState) => state.order.loading;

export const orderErrorSelector = (state: RootState) => state.order.error;

export const profileOrdersSelector = (state: RootState) =>
  state.order.profileOrders;
