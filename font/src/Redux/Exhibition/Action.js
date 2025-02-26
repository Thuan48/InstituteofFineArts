import { BASE_API_URL } from "../../config/api";
import {
  GET_ALL_EXHIBITIONS,
  GET_EXHIBITION_DETAIL,
  ADD_EXHIBITION,
  UPDATE_EXHIBITION,
  DELETE_EXHIBITION,
  SEARCH_EXHIBITIONS
} from "./ActionType";
import { getToken } from "../../utils/tokenManager";

export const getAllExhibitions = (pageNumber = 1, pageSize = 10) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Exhibition?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const resData = await res.json();
    dispatch({ type: GET_ALL_EXHIBITIONS, payload: resData });
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const getExhibitionById = (id) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Exhibition/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    dispatch({ type: GET_EXHIBITION_DETAIL, payload: data });
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const addExhibition = (exhibitionData) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/Exhibition`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(exhibitionData)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    const data = await res.json();
    dispatch({ type: ADD_EXHIBITION, payload: data });
  } catch (error) {
    console.log("catch error:", error.message);
  }
};

export const updateExhibition = (id, exhibitionData) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/Exhibition/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(exhibitionData)
    });

    const data = await res.json();
    dispatch({ type: UPDATE_EXHIBITION, payload: data });
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const deleteExhibition = (id) => async (dispatch) => {
  try {
    const token = getToken();
    await fetch(`${BASE_API_URL}/api/Exhibition/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    dispatch({ type: DELETE_EXHIBITION, payload: id });
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const searchExhibitions = (searchTerm, pageNumber = 1, pageSize = 10) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Exhibition/search?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const resData = await res.json();
    dispatch({ type: SEARCH_EXHIBITIONS, payload: resData });
  } catch (error) {
    console.log("catch error:", error);
  }
};
