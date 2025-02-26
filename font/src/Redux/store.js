import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { competitionReducer } from "./Competition/Reducer";
import { authReducer } from "./Auth/Reducer";
import { userReducer } from "./User/Reducer";
import { submissionReducer } from "./Submissions/Reducer";
import { awardReducer } from "./Award/Reducer";
import exhibitionReducer from "./Exhibition/Reducer";
import exhibitionSubmissionReducer from "./ExhibitionSubmission/Reducer";
import evaluationReducer from "./Evaluation/Reducer";

const rootReducer = combineReducers({
  competitions: competitionReducer,
  auth: authReducer,
  users: userReducer,
  submissions: submissionReducer,
  awards: awardReducer,
  exhibitions: exhibitionReducer,
  exhibitionSubmissions: exhibitionSubmissionReducer,
  evaluations: evaluationReducer,
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
