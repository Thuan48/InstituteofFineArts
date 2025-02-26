import {
  GET_ALL_EVALUATIONS,
  GET_EVALUATION_DETAIL,
  ADD_EVALUATION,
  UPDATE_EVALUATION,
  DELETE_EVALUATION,
  SEARCH_EVALUATIONS
} from "./ActionType";

const initialState = {
  evaluations: [],
  evaluationsTotal: 0,
  evaluationDetail: {}
};

const evaluationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_EVALUATIONS:
      return {
        ...state,
        evaluations: action.payload.data ? action.payload.data : action.payload,
        evaluationsTotal: action.payload.totalRecords || (action.payload.data ? action.payload.data.length : action.payload.length)
      };
    case GET_EVALUATION_DETAIL:
      return { ...state, evaluationDetail: action.payload };
    case ADD_EVALUATION:
      return { ...state, evaluations: [action.payload, ...state.evaluations], evaluationsTotal: state.evaluationsTotal + 1 };
    case UPDATE_EVALUATION:
      return {
        ...state,
        evaluations: state.evaluations.map(ev => ev.evaluationId === action.payload.evaluationId ? action.payload : ev)
      };
    case DELETE_EVALUATION:
      return {
        ...state,
        evaluations: state.evaluations.filter(ev => ev.evaluationId !== action.payload),
        evaluationsTotal: state.evaluationsTotal - 1
      };
    case SEARCH_EVALUATIONS:
      return {
        ...state,
        evaluations: action.payload.data,
        evaluationsTotal: action.payload.totalRecords
      };
    default:
      return state;
  }
};

export default evaluationReducer;
