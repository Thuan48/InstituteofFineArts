import {
  GET_ALL_AWARDS,
  GET_AWARD_DETAIL,
  ADD_AWARD,
  UPDATE_AWARD,
  SEARCH_AWARDS,
  DELETE_AWARD
} from "./ActionType";

const initialState = {
  awards: [],
  selectedAward: null,
};

export const awardReducer = (store = initialState, { type, payload }) => {
  switch (type) {
    case GET_ALL_AWARDS:
      return { ...store, awards: Array.isArray(payload) ? payload : [] };
    case GET_AWARD_DETAIL:
      return { ...store, selectedAward: payload };
    case ADD_AWARD:
      return { ...store, awards: [...store.awards, payload] };
    case UPDATE_AWARD:
      return {
        ...store,
        awards: store.awards.map(award => award.id === payload.id ? payload : award)
      };
    case DELETE_AWARD:
      return {
        ...store,
        awards: store.awards.filter(award => award.id !== payload.id)
      };
    case SEARCH_AWARDS:
      return { ...store, awards: Array.isArray(payload) ? payload : [] };
    default:
      return store;
  }
};
