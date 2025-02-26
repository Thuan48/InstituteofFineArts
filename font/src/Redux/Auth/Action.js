import { BASE_API_URL } from "../../config/api";
import { LOGIN, LOGOUT } from "./ActionType";
import { setToken, removeToken } from "../../utils/tokenManager";

export const login = (credentials) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials)
    });

    const resData = await res.json();
    if (res.ok) {
      setToken(resData.data);
      dispatch({ type: LOGIN, payload: resData });
    } else {
      console.log("Login failed:", resData);
    }
  } catch (error) {
    console.log("catch error:", error);
  }
}

export const logout = () => async (dispatch) => {
  removeToken();
  dispatch({ type: LOGOUT });
}