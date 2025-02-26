import {
  GET_ALL_EXHIBITION_SUBMISSIONS,
  GET_EXHIBITION_SUBMISSION_DETAIL,
  ADD_EXHIBITION_SUBMISSION,
  UPDATE_EXHIBITION_SUBMISSION,
  DELETE_EXHIBITION_SUBMISSION,
  SEARCH_EXHIBITION_SUBMISSIONS
} from "./ActionType";

const initialState = {
  exhibitionSubmissions: [],
  exhibitionSubmission: null,
};

const exhibitionSubmissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_EXHIBITION_SUBMISSIONS:
      return {
        ...state,
        exhibitionSubmissions: action.payload,
      };
    case GET_EXHIBITION_SUBMISSION_DETAIL:
      return {
        ...state,
        exhibitionSubmission: action.payload,
      };
    case ADD_EXHIBITION_SUBMISSION:
      return {
        ...state,
        exhibitionSubmissions: [...state.exhibitionSubmissions, action.payload],
      };
    case UPDATE_EXHIBITION_SUBMISSION:
      return {
        ...state,
        exhibitionSubmissions: state.exhibitionSubmissions.map(exhibitionSubmission =>
          exhibitionSubmission.id === action.payload.id ? action.payload : exhibitionSubmission
        ),
      };
    case DELETE_EXHIBITION_SUBMISSION:
      return {
        ...state,
        exhibitionSubmissions: state.exhibitionSubmissions.filter(exhibitionSubmission => exhibitionSubmission.id !== action.payload),
      };
    case SEARCH_EXHIBITION_SUBMISSIONS:
      return {
        ...state,
        exhibitionSubmissions: action.payload,
      };
    default:
      return state;
  }
};

export default exhibitionSubmissionReducer;
