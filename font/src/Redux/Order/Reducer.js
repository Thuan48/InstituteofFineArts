import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  CREATE_PAYMENT_REQUEST,
  CREATE_PAYMENT_SUCCESS,
  CREATE_PAYMENT_FAILURE,
  PAYMENT_CALLBACK_REQUEST,
  PAYMENT_CALLBACK_SUCCESS,
  PAYMENT_CALLBACK_FAILURE
} from './ActionType';

const initialState = {
  order: null,
  payment: null,
  loading: false,
  error: null,
  paymentStatus: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
    case CREATE_PAYMENT_REQUEST:
    case PAYMENT_CALLBACK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload,
      };
    case CREATE_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        payment: action.payload,
      };
    case PAYMENT_CALLBACK_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentStatus: action.payload.status,
      };
    case CREATE_ORDER_FAILURE:
    case CREATE_PAYMENT_FAILURE:
    case PAYMENT_CALLBACK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        paymentStatus: 'failure',
      };
    default:
      return state;
  }
};

export default orderReducer;
