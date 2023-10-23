/* eslint-disable no-use-before-define */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PRICE_LIMIT } from '../utils/constants';
import { api } from '../utils/Api';

// обработчик загрузки карточек
export const getMinMaxCost = createAsyncThunk(
  'dataProductsState/getProducts',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const data = await api.getMinMaxCost();
      dispatch(setMinMaxCost(data));
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const setError = (state, action) => {
  const errMessage = action.payload.detail || action.payload.message;
  console.log(errMessage);
  state.statu = 'rejected';
  state.error = errMessage;
};
const SetPending = (state) => {
  state.status = 'loading';
  state.is_loading = true;
  state.error = null;
};
const setFulfilled = (state) => {
  state.is_loading = false;
};

const dataSearchFormSlice = createSlice({
  name: 'dataSearchForm',
  initialState: {
    search: null,
    categories: { 1: false, 2: false, 3: false, 4: false },
    prices: [0, 0],
    sorting: null,
    min_max: {
      price__min: PRICE_LIMIT.min,
      price__max: PRICE_LIMIT.max,
    },
  },
  reducers: {
    collecSearch(state, action) {
      state.search = action.payload;
    },
    collectCategories(state, action) {
      const newState = action.payload;
      const { categories } = state;
      state.categories = { ...categories, ...newState };
    },
    collecPrices(state, action) {
      state.prices = action.payload;
    },
    collecSorting(state, action) {
      state.sorting = action.payload;
    },
    ressetFiltersState(state) {
      state.prices = [state.min_max.price__min, state.min_max.price__max];
      state.categories = { 1: false, 2: false, 3: false, 4: false };
    },
    setMinMaxCost(state, action) {
      state.min_max = action.payload;
      state.prices = [state.min_max.price__min, state.min_max.price__max];
    },
  },
  extraReducers: {
    [getMinMaxCost.pending]: SetPending,
    [getMinMaxCost.fulfilled]: setFulfilled,
    [getMinMaxCost.rejected]: setError,
  },
});
export const {
  collecSearch,
  collectCategories,
  collecPrices,
  collecSorting,
  ressetFiltersState,
  setMinMaxCost,
} = dataSearchFormSlice.actions;
export default dataSearchFormSlice.reducer;
