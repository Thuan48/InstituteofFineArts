import { GET_ALL_COMPETITIONS, GET_COMPETITION_DETAIL, ADD_COMPETITION, UPDATE_COMPETITION, DELETE_COMPETITION } from "./ActionType";

const initialValue = {
  competitions: [],
  selectedCompetition: null,
};

export const competitionReducer = (store = initialValue, { type, payload }) => {
  switch (type) {
    case GET_ALL_COMPETITIONS:
      return {
        ...store,
        competitions: Array.isArray(payload) ? payload : [],
      };
    case GET_COMPETITION_DETAIL:
      return {
        ...store,
        selectedCompetition: payload,
      };
    case ADD_COMPETITION:
      return {
        ...store,
        competitions: [...store.competitions, payload],
      };
    case UPDATE_COMPETITION:
      return {
        ...store,
        competitions: store.competitions.map(comp => comp.competitionId === payload.competitionId ? payload : comp),
      };
    case DELETE_COMPETITION:
      return {
        ...store,
        competitions: store.competitions.filter(comp => comp.competitionId !== payload),
      };
    default:
      return store;
  }
}