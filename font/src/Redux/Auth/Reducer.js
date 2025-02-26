import { LOGIN, LOGOUT } from "./ActionType";

const initialValue = {
  users: {},
  currentUser: {},
};

export const authReducer = (store = initialValue, { type, payload }) => {
  switch (type) {
    case LOGIN:
      return {
        ...store,
        users: payload,
      };
    case LOGOUT:
      return {
        ...store,
        users: {},
      };
    default:
      return store;
  }
}