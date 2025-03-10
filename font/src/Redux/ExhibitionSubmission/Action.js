import { BASE_API_URL } from "../../config/api";
import {
  GET_ALL_EXHIBITION_SUBMISSIONS,
  GET_EXHIBITION_SUBMISSION_DETAIL,
  ADD_EXHIBITION_SUBMISSION,
  UPDATE_EXHIBITION_SUBMISSION,
  DELETE_EXHIBITION_SUBMISSION,
  SEARCH_EXHIBITION_SUBMISSIONS
} from "./ActionType";
import { getToken } from "../../utils/tokenManager";

// Lấy danh sách exhibition submissions theo phân trang
export const getAllExhibitionSubmissions = (pageNumber = 1, pageSize = 10) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/ExhibitionSubmission?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const resData = await res.json();
    // Nếu API trả về cấu trúc chứa totalRecords thì cập nhật payload theo đó
    dispatch({ 
      type: GET_ALL_EXHIBITION_SUBMISSIONS, 
      payload: { exhibitionSubmissions: resData, totalRecords: resData.length } 
    });
  } catch (error) {
    console.log("catch error:", error);
  }
};

// Lấy chi tiết 1 submission theo id
export const getExhibitionSubmissionById = (id) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/ExhibitionSubmission/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    dispatch({ type: GET_EXHIBITION_SUBMISSION_DETAIL, payload: data });
  } catch (error) {
    console.log("catch error:", error);
  }
};

// Thêm một submission mới
export const addExhibitionSubmission = (exhibitionSubmissionData) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/ExhibitionSubmission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(exhibitionSubmissionData)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    const data = await res.json();
    dispatch({ type: ADD_EXHIBITION_SUBMISSION, payload: data });
  } catch (error) {
    console.log("catch error:", error.message);
  }
};

// Cập nhật thông tin của 1 submission (chỉ cập nhật Price và Status)
export const updateExhibitionSubmission = (id, submissionData) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/ExhibitionSubmission/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(submissionData)
    });

    // Nếu không thành công, đọc lỗi dạng text rồi ném ra
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to update submission");
    }

    const data = await res.json();
    // data.data chứa thông tin submission đã được cập nhật (theo API của bạn)
    dispatch({ type: UPDATE_EXHIBITION_SUBMISSION, payload: data.data });
  } catch (error) {
    console.log("catch error:", error);
    throw error;
  }
};

// Xóa 1 submission
export const deleteExhibitionSubmission = (id) => async (dispatch) => {
  try {
    const token = getToken();
    await fetch(`${BASE_API_URL}/api/ExhibitionSubmission/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    dispatch({ type: DELETE_EXHIBITION_SUBMISSION, payload: id });
  } catch (error) {
    console.log("catch error:", error);
  }
};

// Tìm kiếm submissions theo từ khóa (với phân trang)
export const searchExhibitionSubmissions = (searchTerm, pageNumber = 1, pageSize = 10) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(
      `${BASE_API_URL}/api/ExhibitionSubmission/search?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const resData = await res.json();
    dispatch({ type: SEARCH_EXHIBITION_SUBMISSIONS, payload: resData });
  } catch (error) {
    console.log("catch error:", error);
  }
};
