import {
  GET_ALL_SUBMISSIONS,
  GET_SUBMISSION_DETAIL,
  ADD_SUBMISSION,
  UPDATE_SUBMISSION,
  DELETE_SUBMISSION,
  SEARCH_SUBMISSIONS
} from "./ActionType";

const initialValue = {
  submissions: [],
  selectedSubmission: null,
};

export const submissionReducer = (store = initialValue, { type, payload }) => {
  switch (type) {
    case GET_ALL_SUBMISSIONS:
    case SEARCH_SUBMISSIONS:
      return {
        ...store,
        submissions: Array.isArray(payload) ? payload : [],
      };
    case GET_SUBMISSION_DETAIL:
      return {
        ...store,
        selectedSubmission: payload,
      };
    case ADD_SUBMISSION:
      return {
        ...store,
        submissions: [...store.submissions, payload],
      };
    case UPDATE_SUBMISSION:
      return {
        ...store,
        submissions: store.submissions.map(submission =>
          submission.id === payload.id ? payload : submission
        ),
      };
    case DELETE_SUBMISSION:
      return {
        ...store,
        submissions: store.submissions.filter(submission => submission.id !== payload.id),
      };
    default:
      return store;
  }
};
