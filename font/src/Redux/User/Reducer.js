import { FETCH_USER_BY_ID, FETCH_USERS, FETCH_CURRENT_USER, ADD_USER, UPDATE_USER, DELETE_USER, EXPORT_EXCEL, IMPORT_EXCEL } from "./ActionType";

const initialValue = {
  users: [],
  currentUser: null,
  user: null, // Add this line to store the fetched user by ID
};

export const userReducer = (store = initialValue, { type, payload }) => {
  switch (type) {
    case FETCH_USERS:
      return {
        ...store,
        users: payload,
      };
    case FETCH_USER_BY_ID:
      return {
        ...store,
        user: payload, // Update the user state
      };
    case FETCH_CURRENT_USER:
      return {
        ...store,
        currentUser: payload,
      };
    case ADD_USER:
      return {
        ...store,
        users: [...store.users, payload],
      };
    case UPDATE_USER:
      return {
        ...store,
        users: store.users.map(user => user.userId === payload.userId ? payload : user),
      };
    case DELETE_USER:
      return {
        ...store,
        users: store.users.filter(user => user.userId !== payload),
      };
    case EXPORT_EXCEL:
    case IMPORT_EXCEL:
      return store;
    default:
      return store;
  }
};
