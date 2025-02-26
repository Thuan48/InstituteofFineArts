import {
  GET_ALL_EXHIBITIONS,
  GET_EXHIBITION_DETAIL,
  ADD_EXHIBITION,
  UPDATE_EXHIBITION,
  DELETE_EXHIBITION,
  SEARCH_EXHIBITIONS
} from "./ActionType";

const initialState = {
  exhibitions: [],
  exhibition: null,
};

const exhibitionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_EXHIBITIONS:
      return {
        ...state,
        exhibitions: action.payload,
      };
    case GET_EXHIBITION_DETAIL:
      return {
        ...state,
        exhibition: action.payload,
      };
    case ADD_EXHIBITION:
      return {
        ...state,
        exhibitions: [...state.exhibitions, action.payload],
      };
    case UPDATE_EXHIBITION:
      return {
        ...state,
        exhibitions: state.exhibitions.map(exhibition =>
          exhibition.id === action.payload.id ? action.payload : exhibition
        ),
      };
    case DELETE_EXHIBITION:
      return {
        ...state,
        exhibitions: state.exhibitions.filter(exhibition => exhibition.id !== action.payload),
      };
    case SEARCH_EXHIBITIONS:
      return {
        ...state,
        exhibitions: action.payload,
      };
    default:
      return state;
  }
};

export default exhibitionReducer;
