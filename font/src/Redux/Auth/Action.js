import { BASE_API_URL } from "../../config/api";
import { LOGIN, LOGOUT, LOGIN_FAILURE } from "./ActionType";
import { setToken, removeToken } from "../../utils/tokenManager";
import Cookies from "js-cookie";

export const login = (credentials, rememberMe) => async (dispatch) => {
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
      if (rememberMe) {
        Cookies.set("token", resData.data, { expires: 7 });
        Cookies.set("email", credentials.email, { expires: 7 });
        Cookies.set("password", credentials.password, { expires: 7 });
      }
      dispatch({ type: LOGIN, payload: resData });
      return { success: true };
    } else {
      dispatch({ type: LOGIN_FAILURE, payload: resData.message });
      return { success: false, message: resData.message };
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: "An error occurred. Please try again." });
    return { success: false, message: "An error occurred. Please try again." };
  }
}

export const logout = () => async (dispatch) => {
  removeToken();
  Cookies.remove("token");
  Cookies.remove("email");
  Cookies.remove("password");
  dispatch({ type: LOGOUT });
}