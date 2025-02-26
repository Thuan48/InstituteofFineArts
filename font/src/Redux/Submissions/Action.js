import { BASE_API_URL } from "../../config/api";
import {
  GET_ALL_SUBMISSIONS,
  GET_SUBMISSION_DETAIL,
  ADD_SUBMISSION,
  UPDATE_SUBMISSION,
  DELETE_SUBMISSION,
  SEARCH_SUBMISSIONS
} from "./ActionType";

export const getAllSubmissions = () => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Submission`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const resData = await res.json();
    dispatch({ type: GET_ALL_SUBMISSIONS, payload: resData });
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const getSubmissionById = (id) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Submission/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    dispatch({ type: GET_SUBMISSION_DETAIL, payload: data });
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const addSubmission = (submission) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Submission`, {
      method: "POST",
      body: submission
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }
    const data = await res.json();
    dispatch({ type: ADD_SUBMISSION, payload: data });
  } catch (error) {
    console.log("catch error:", error.message);
  }
};

export const updateSubmission = (id, submission) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Submission/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission)
    });
    const data = await res.json();
    dispatch({ type: UPDATE_SUBMISSION, payload: data });
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const deleteSubmission = (id) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Submission/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    dispatch({ type: DELETE_SUBMISSION, payload: data });
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const searchSubmissions = (searchTerm, pageNumber = 1, pageSize = 6) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/Submission/search?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const resData = await res.json();
    dispatch({ type: SEARCH_SUBMISSIONS, payload: resData });
  } catch (error) {
    console.log("catch error:", error);
  }
};
