import {
  FETCH_SALES,
  FETCH_SALE_BY_ID,
  ADD_SALE,
  UPDATE_SALE,
  DELETE_SALE,
  SEARCH_SALES,
  SALE_ERROR,
  SALE_LOADING
} from './ActionType';

const initialState = {
  sales: [],
  sale: null,
  searchResults: [],
  loading: false,
  error: null
};

const saleReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SALES:
      return {
        ...state,
        sales: action.payload,
        loading: false
      };
    case FETCH_SALE_BY_ID:
      return {
        ...state,
        sale: action.payload,
        loading: false
      };
    case ADD_SALE:
      return {
        ...state,
        sales: [...state.sales, action.payload],
        loading: false
      };
    case UPDATE_SALE:
      return {
        ...state,
        sales: state.sales.map(sale =>
          sale.saleId === action.payload.saleId ? action.payload : sale
        ),
        loading: false
      };
    case DELETE_SALE:
      return {
        ...state,
        sales: state.sales.filter(sale => sale.saleId !== action.payload),
        loading: false
      };
    case SEARCH_SALES:
      return {
        ...state,
        sales: action.payload,
        loading: false
      };
    case SALE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case SALE_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export default saleReducer;
