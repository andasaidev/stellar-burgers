import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

interface IngredientsState {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null
};

export const getIngredients = createAsyncThunk(
  'ingredient/get',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = action.payload;
      });
  }
});

export default ingredientsSlice.reducer;

// Селекторы для ingredient
export const ingredientsSelector = (state: RootState) =>
  state.ingredients.items;

export const ingredientsLoadingSelector = (state: RootState) =>
  state.ingredients.loading;

export const ingredientsErrorSelector = (state: RootState) =>
  state.ingredients.error;

export const bunsSelector = createSelector(
  ingredientsSelector,
  (ingredients: TIngredient[]) =>
    ingredients.filter((item: TIngredient) => item.type === 'bun')
);

export const mainsSelector = createSelector(
  ingredientsSelector,
  (ingredients: TIngredient[]) =>
    ingredients.filter((item: TIngredient) => item.type === 'main')
);

export const saucesSelector = createSelector(
  ingredientsSelector,
  (ingredients: TIngredient[]) =>
    ingredients.filter((item: TIngredient) => item.type === 'sauce')
);
