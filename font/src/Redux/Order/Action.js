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
import { BASE_API_URL } from "../../config/api";

export const createOrder = (orderData) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST });
  try {
    const response = await fetch(`${BASE_API_URL}/api/order/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    if (response.ok) {
      dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
      window.location.href = data.paymentUrl; // Redirect to payment URL
    } else {
      dispatch({ type: CREATE_ORDER_FAILURE, payload: data.message });
    }
  } catch (error) {
    dispatch({ type: CREATE_ORDER_FAILURE, payload: error.message });
  }
};

export const createPayment = (paymentData) => async (dispatch) => {
  dispatch({ type: CREATE_PAYMENT_REQUEST });
  try {
    const response = await fetch(`${BASE_API_URL}/api/payment/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    const data = await response.json();
    if (response.ok) {
      dispatch({ type: CREATE_PAYMENT_SUCCESS, payload: data });
    } else {
      dispatch({ type: CREATE_PAYMENT_FAILURE, payload: data.message });
    }
  } catch (error) {
    dispatch({ type: CREATE_PAYMENT_FAILURE, payload: error.message });
  }
};

export const paymentCallback = (query) => async (dispatch) => {
  dispatch({ type: PAYMENT_CALLBACK_REQUEST });
  try {
    const response = await fetch(`${BASE_API_URL}/api/payment/payment-execute${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (response.ok && data.responseCode[0] === "00") {
      dispatch({ type: PAYMENT_CALLBACK_SUCCESS, payload: data });
      return data;
    } else {
      dispatch({ type: PAYMENT_CALLBACK_FAILURE, payload: data.message || 'Payment failed' });
      return { status: 'failure' };
    }
  } catch (error) {
    dispatch({ type: PAYMENT_CALLBACK_FAILURE, payload: error.message });
    return { status: 'failure' };
  }
};

