import { BASE_API_URL } from "../../config/api";
import {
  GET_ALL_AWARDS,
  GET_AWARD_DETAIL,
  ADD_AWARD,
  UPDATE_AWARD,
  DELETE_AWARD,
  SEARCH_AWARDS
} from "./ActionType";
import { getToken } from "../../utils/tokenManager";

export const getAllAwards = () => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Award`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    dispatch({ type: GET_ALL_AWARDS, payload: data });
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const getAwardById = (id) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Award/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    dispatch({ type: GET_AWARD_DETAIL, payload: data });
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const addAward = (award) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/Award`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(award)
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }
    const data = await res.json();
    dispatch({ type: ADD_AWARD, payload: data });
  } catch (error) {
    console.log("catch error:", error.message);
  }
};

export const updateAward = (id, award) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/Award/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(award)
    });
    const data = await res.json();
    dispatch({ type: UPDATE_AWARD, payload: data });
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const deleteAward = (id) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/Award/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    dispatch({ type: DELETE_AWARD, payload: { id } });
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const searchAwards = (searchTerm, pageNumber, pageSize) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Award/search?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    dispatch({ type: SEARCH_AWARDS, payload: data });
  } catch (error) {
    console.log("catch error:", error);
  }
};
