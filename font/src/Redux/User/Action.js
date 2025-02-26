import { BASE_API_URL } from "../../config/api";
import { FETCH_USERS, FETCH_USER_BY_ID, FETCH_CURRENT_USER, ADD_USER, UPDATE_USER, DELETE_USER } from "./ActionType";
import { getToken } from "../../utils/tokenManager";

export const fetchUsers = () => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: FETCH_USERS, payload: resData });
    } else {
      console.log("fetch data fail", resData);
    }
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const fetchUserById = (id) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: FETCH_USER_BY_ID, payload: resData });
      console.log("fetch user by id success", resData);
    } else {
      console.log("fetch data fail", resData);
    }
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const fetchCurrentUser = (token) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/user/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: FETCH_CURRENT_USER, payload: resData });
    } else {
      console.log("fetch current user fail", resData);
    }
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const addUser = (user) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: ADD_USER, payload: resData });
    } else {
      console.log("add user fail", resData);
    }
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const updateUser = (id, user) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('Name', user.name);
    formData.append('Email', user.email);
    if (user.uploadImage) {
      formData.append('UploadImage', user.uploadImage);
    }
    const res = await fetch(`${BASE_API_URL}/api/user/${id}`, {
      method: "PUT",
      body: formData,
    });

    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: UPDATE_USER, payload: resData });
    } else {
      console.log("update user fail", resData);
    }
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const updateRole = (id, newRole) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/user/${id}/update-role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(newRole)
    });

    const text = await res.text();
    let resData;
    try {
      resData = text ? JSON.parse(text) : {};
    } catch (e) {
      resData = {};
    }

    if (res.ok) {
      dispatch({ type: UPDATE_USER, payload: resData });
    } else {
      console.log("update role fail", resData);
    }
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    if (res.status === 204) {
      dispatch({ type: DELETE_USER, payload: id });
    } else {
      const resData = await res.json();
      console.log("delete user fail", resData);
    }
  } catch (error) {
    console.log("catch error:", error);
  }
};

export const searchUser = (keyword) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/user/search?keyword=${encodeURIComponent(keyword)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: FETCH_USERS, payload: resData });
    } else {
      console.log("search user fail", resData);
    }
  } catch (error) {
    console.log("catch error:", error);
  }
};

// Updated exportExcel action
export const exportExcel = () => async (dispatch) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/user/export-excel`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } else {
      console.log("Export Excel failed");
    }
  } catch (error) {
    console.log("Export Excel error:", error);
  }
};

// Updated importExcel action
export const importExcel = (file) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const token = getToken();
    const res = await fetch(`${BASE_API_URL}/api/user/import-excel`, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });
    const resData = await res.json();
    if (res.ok) {
      alert(`Import successful: ${resData.Success} users added.`);
      dispatch(fetchUsers());
    } else {
      alert("Import failed: " + resData.Errors.join(", "));
    }
  } catch (error) {
    console.log("Import action error:", error);
  }
};
