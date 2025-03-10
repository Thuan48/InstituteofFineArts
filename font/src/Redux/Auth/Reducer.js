import { LOGIN, LOGOUT, LOGIN_FAILURE } from "./ActionType";

const initialValue = {
  users: {},
  currentUser: {},
  loginError: null,
};

export const authReducer = (store = initialValue, { type, payload }) => {
  switch (type) {
    case LOGIN:
      return {
        ...store,
        users: payload,
        currentUser: payload.user,
        loginError: null,
      };
    case LOGOUT:
      return {
        ...store,
        users: {},
        currentUser: {},
        loginError: null,
      };
    case LOGIN_FAILURE:
      return {
        ...store,
        loginError: payload,
      };
    default:
      return store;
  }
}