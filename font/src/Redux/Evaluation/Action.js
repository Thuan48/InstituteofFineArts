import { BASE_API_URL } from "../../config/api";
import {
  GET_ALL_EVALUATIONS,
  GET_EVALUATION_DETAIL,
  ADD_EVALUATION,
  UPDATE_EVALUATION,
  DELETE_EVALUATION,
  SEARCH_EVALUATIONS
} from "./ActionType";
import { getToken } from "../../utils/tokenManager";

export const getAllEvaluations = (pageNumber = 1, pageSize = 10) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Evaluation?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    dispatch({ type: GET_ALL_EVALUATIONS, payload: data });
  } catch (error) {
    console.log("catch error:", error.message);
  }
};

export const getEvaluationById = (id) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Evaluation/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    dispatch({ type: GET_EVALUATION_DETAIL, payload: data });
  } catch (error) {
    console.log("catch error:", error.message);
  }
};

export const addEvaluation = (evaluationData) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/Evaluation`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(evaluationData)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    dispatch({ type: ADD_EVALUATION, payload: data });
  } catch (error) {
    console.log("catch error:", error.message);
  }
};

export const updateEvaluation = (id, evaluationData) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/Evaluation/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(evaluationData)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    dispatch({ type: UPDATE_EVALUATION, payload: data });
  } catch (error) {
    console.log("catch error:", error.message);
  }
};

export const deleteEvaluation = (id) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/Evaluation/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error(await res.text());
    dispatch({ type: DELETE_EVALUATION, payload: id });
  } catch (error) {
    console.log("catch error:", error.message);
  }
};

export const searchEvaluations = (searchTerm, pageNumber = 1, pageSize = 10) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Evaluation/search?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    dispatch({ type: SEARCH_EVALUATIONS, payload: data });
  } catch (error) {
    console.log("catch error:", error.message);
  }
};
