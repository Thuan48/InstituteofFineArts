import { BASE_API_URL } from "../../config/api";
import { GET_ALL_COMPETITIONS, GET_COMPETITION_DETAIL, ADD_COMPETITION, UPDATE_COMPETITION, DELETE_COMPETITION } from "./ActionType";
import { getToken } from "../../utils/tokenManager";

export const getAllCompetitions = (pageNumber = 1, pageSize = 6) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Competition?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    const resData = await res.json();
    dispatch({ type: GET_ALL_COMPETITIONS, payload: resData });
  } catch (error) {
    console.log("catch error:", error.message);
  }
}

export const getCompetitionById = (id) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Competition/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    const data = await res.json();
    dispatch({ type: GET_COMPETITION_DETAIL, payload: data });
  } catch (error) {
    console.log("catch error:", error.message);
  }
}

export const addCompetition = (competitionData) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/Competition`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: competitionData
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    const data = await res.json();
    dispatch({ type: ADD_COMPETITION, payload: data });
  } catch (error) {
    console.log("catch error:", error.message);
  }
}

export const updateCompetition = (id, competitionData) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/Competition/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: competitionData
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    const data = await res.json();
    dispatch({ type: UPDATE_COMPETITION, payload: data });
  } catch (error) {
    console.log("catch error:", error.message);
  }
}

export const deleteCompetition = (id) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/Competition/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    dispatch({ type: DELETE_COMPETITION, payload: id });
  } catch (error) {
    console.log("catch error:", error.message);
  }
}

export const searchCompetitions = (searchTerm, pageNumber = 1, pageSize = 6) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Competition/search?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    const resData = await res.json();
    dispatch({ type: GET_ALL_COMPETITIONS, payload: resData });
  } catch (error) {
    console.log("catch error:", error.message);
  }
}