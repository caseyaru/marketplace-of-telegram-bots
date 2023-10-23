/* eslint-disable no-use-before-define */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../utils/Api';

// обработчик загрузки карточек
export const getProducts = createAsyncThunk(
  'dataProductsState/getProducts',
  async (params, { rejectWithValue, dispatch }) => {
    try {
      const data = await api.getProducts(params);
      dispatch(changeProductsAllStates(data));
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
// обработчик подгрузки карточек
export const getMoreProducts = createAsyncThunk(
  'dataProductsState/getMoreProducts',
  async (params, { rejectWithValue, dispatch }) => {
    try {
      const data = await api.getProducts(params);
      dispatch(changeMoreProducts(data));
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
// обработчик загрузки избранных
export const getFavorites = createAsyncThunk(
  'dataProductsState/getFavorites',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const data = await api.getProducts('?is_favorited=True');
      dispatch(changeFavoritesAllStates(data));
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
// обработчик подгрузки избранных
export const getMoreFavorites = createAsyncThunk(
  'dataProductsState/getMoreFavorites',
  async (params, { rejectWithValue, dispatch }) => {
    try {
      const data = await api.getProducts(params);
      dispatch(changeMoreFavorites(data));
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
// обработчик лайков и дизлайков
export const onLike = createAsyncThunk(
  'dataProductsState/onLike',
  async (card, { rejectWithValue, dispatch }) => {
    let isLiked = card.is_favorited;
    try {
      if (!isLiked) {
        // Добавляем карточку
        await api.postProductFavorite(card.id);
        dispatch(getFavorites());
        isLiked = true;
      } else {
        // Удаляем карточку
        await api.deleteProductFavorite(card.id);
        dispatch(deleteLikeInFavorites(card.id));
        isLiked = false;
      }
      dispatch(toggleLike(card.id));
      return isLiked;
    } catch (err) {
      console.log('cbCardLike => err', err); // Консоль
      return rejectWithValue(err);
    }
  }
);

const setError = (state, action) => {
  const errMessage = action.payload.detail || action.payload.message;
  console.log(errMessage);
  state.status = 'rejected';
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

const dataProductsStateSlice = createSlice({
  name: 'dataProductsState',
  initialState: {
    count: 0,
    next: null,
    previous: null,
    results: [],
    favoritesCount: 0,
    favoritesNext: null,
    favoritesPrevious: null,
    favoritesResults: [],
    status: null,
    error: null,
    is_loading: false,
  },
  reducers: {
    toggleLike(state, action) {
      // const productCard = state.results.find(
      //   (card) => card.id === action.payload
      // );
      // productCard.is_favorited = !productCard.is_favorited;
      state.results = state.results.map((c) => {
        return c.id === action.payload
          ? { ...c, is_favorited: !c.is_favorited }
          : c;
      });
    },
    deleteLikeInFavorites(state, action) {
      state.favoritesResults = state.favoritesResults.filter(
        (card) => card.id !== action.payload
      );
      state.favoritesCount -= 1;
    },

    changeProductsResults(state, action) {
      state.results = action.payload;
    },
    changeProductsAllStates(state, action) {
      state.count = action.payload.count;
      state.next = action.payload.next;
      state.previous = action.payload.previous;
      state.results = action.payload.results;
    },
    changeMoreProducts(state, action) {
      state.count = action.payload.count;
      state.next = action.payload.next;
      state.previous = action.payload.previous;
      state.results.push(...action.payload.results);
    },
    changeFavoritesResults(state, action) {
      state.favoritesResults = action.payload;
    },
    changeFavoritesAllStates(state, action) {
      state.favoritesCount = action.payload.count;
      state.favoritesNext = action.payload.next;
      state.favoritesPrevious = action.payload.previous;
      state.favoritesResults = action.payload.results;
    },
    changeMoreFavorites(state, action) {
      state.favoritesCount = action.payload.count;
      state.favoritesNext = action.payload.next;
      state.favoritesPrevious = action.payload.previous;
      state.favoritesResults.push(...action.payload.results);
    },
    cleanLike(state) {
      state.favoritesCount = 0;
      state.favoritesNext = null;
      state.favoritesPrevious = null;
      state.favoritesResults = [];
    },
  },
  extraReducers: {
    [getProducts.pending]: SetPending,
    [getProducts.fulfilled]: setFulfilled,
    [getProducts.rejected]: setError,

    [getMoreProducts.pending]: SetPending,
    [getMoreProducts.fulfilled]: setFulfilled,
    [getMoreProducts.rejected]: setError,

    [getFavorites.pending]: SetPending,
    [getFavorites.fulfilled]: setFulfilled,
    [getFavorites.rejected]: setError,

    [getMoreFavorites.pending]: SetPending,
    [getMoreFavorites.fulfilled]: setFulfilled,
    [getMoreFavorites.rejected]: setError,
  },
});

export const {
  toggleLike,
  deleteLikeInFavorites,
  changeProductsResults,
  changeProductsAllStates,
  changeMoreProducts,
  changeFavoritesResults,
  changeFavoritesAllStates,
  changeMoreFavorites,
  cleanLike,
} = dataProductsStateSlice.actions;
export default dataProductsStateSlice.reducer;
