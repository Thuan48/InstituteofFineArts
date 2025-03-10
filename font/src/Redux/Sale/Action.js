import {
  FETCH_SALES,
  FETCH_SALE_BY_ID,
  ADD_SALE,
  UPDATE_SALE,
  DELETE_SALE,
  SEARCH_SALES,
  SALE_ERROR,
  SALE_LOADING
} from './ActionType';
import { BASE_API_URL } from "../../config/api";
import { getToken } from "../../utils/tokenManager";

export const fetchSales = () => async (dispatch) => {
  dispatch({ type: SALE_LOADING, payload: true });
  try {
    const res = await fetch(`${BASE_API_URL}/api/sale`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: FETCH_SALES, payload: resData });
    } else {
      dispatch({ type: SALE_ERROR, payload: resData });
    }
  } catch (error) {
    dispatch({ type: SALE_ERROR, payload: error });
  }
};

export const fetchSaleById = (id) => async (dispatch) => {
  dispatch({ type: SALE_LOADING, payload: true });
  try {
    const res = await fetch(`${BASE_API_URL}/api/sale/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: FETCH_SALE_BY_ID, payload: resData });
    } else {
      dispatch({ type: SALE_ERROR, payload: resData });
    }
  } catch (error) {
    dispatch({ type: SALE_ERROR, payload: error });
  }
};

export const addSale = (sale) => async (dispatch) => {
  dispatch({ type: SALE_LOADING, payload: true });
  try {
    const res = await fetch(`${BASE_API_URL}/api/sale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify(sale),
    });
    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: ADD_SALE, payload: resData });
    } else {
      dispatch({ type: SALE_ERROR, payload: resData });
    }
  } catch (error) {
    dispatch({ type: SALE_ERROR, payload: error });
  }
};

export const updateSale = (id, sale) => async (dispatch) => {
  dispatch({ type: SALE_LOADING, payload: true });
  try {
    const res = await fetch(`${BASE_API_URL}/api/sale/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify(sale),
    });
    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: UPDATE_SALE, payload: resData });
    } else {
      dispatch({ type: SALE_ERROR, payload: resData });
    }
  } catch (error) {
    dispatch({ type: SALE_ERROR, payload: error });
  }
};

export const deleteSale = (id) => async (dispatch) => {
  dispatch({ type: SALE_LOADING, payload: true });
  try {
    const res = await fetch(`${BASE_API_URL}/api/sale/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
    });
    if (res.ok) {
      dispatch({ type: DELETE_SALE, payload: id });
    } else {
      const resData = await res.json();
      dispatch({ type: SALE_ERROR, payload: resData });
    }
  } catch (error) {
    dispatch({ type: SALE_ERROR, payload: error });
  }
};

export const searchSales = (searchTerm, pageNumber = 1, pageSize = 10) => async (dispatch) => {
  dispatch({ type: SALE_LOADING, payload: true });
  try {
    const res = await fetch(`${BASE_API_URL}/api/sale/search?searchTerm=${encodeURIComponent(searchTerm)}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: SEARCH_SALES, payload: resData });
      return { payload: resData }; // Ensure the result is returned
    } else {
      dispatch({ type: SALE_ERROR, payload: resData });
      return { payload: null };
    }
  } catch (error) {
    dispatch({ type: SALE_ERROR, payload: error });
    return { payload: null };
  }
};
