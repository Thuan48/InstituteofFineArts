import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import HomeAppBar from '../HomeAppBar';
import { paymentCallback } from '../../Redux/Order/Action';

const CallBack = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionDetails, setTransactionDetails] = useState({});

  useEffect(() => {
    const query = location.search;
    const handlePaymentCallback = async () => {
      const result = await dispatch(paymentCallback(query));
      if (result && result.status) {
        setStatus(result.status);
        setTransactionDetails({
          amount: result.amount[0],
          bankCode: result.bankCode[0],
          bankTranNo: result.bankTranNo[0],
          cardType: result.cardType[0],
          orderInfo: result.orderInfo[0],
          payDate: result.payDate[0],
          responseCode: result.responseCode[0],
          tmnCode: result.tmnCode[0],
          transactionNo: result.transactionNo[0],
          transactionStatus: result.transactionStatus[0],
          txnRef: result.txnRef[0],
        });
      } else {
        setStatus('failure');
      }
      setLoading(false);
    };

    handlePaymentCallback();
  }, [location, dispatch]);

  return (
    <>
      <HomeAppBar />
      <div className="mt-32 flex justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : status === 'success' ? (
            <>
              <div className="flex items-center justify-center space-x-2 mb-4 mt-2">
                <FaCheckCircle className="text-3xl text-green-600" />
                <h2 className="font-bold text-2xl text-green-600">Payment Successful!</h2>
              </div>
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <FaInfoCircle className="text-2xl" />
                  <h3 className="font-bold text-xl">Payment Details</h3>
                </div>
                <p><span className="font-semibold">Transaction ID:</span> {transactionDetails.transactionNo}</p>
                <p><span className="font-semibold">Amount:</span> {transactionDetails.amount}</p>
                <p><span className="font-semibold">Bank Code:</span> {transactionDetails.bankCode}</p>
                <p><span className="font-semibold">Bank Transaction No:</span> {transactionDetails.bankTranNo}</p>
                <p><span className="font-semibold">Card Type:</span> {transactionDetails.cardType}</p>
                <p><span className="font-semibold">Order Info:</span> {transactionDetails.orderInfo}</p>
                <p><span className="font-semibold">Pay Date:</span> {transactionDetails.payDate}</p>
                <p><span className="font-semibold">Response Code:</span> {transactionDetails.responseCode}</p>
                <p><span className="font-semibold">Transaction Status:</span> {transactionDetails.transactionStatus}</p>
                <p><span className="font-semibold">Transaction Reference:</span> {transactionDetails.txnRef}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <FaTimesCircle className="text-3xl text-red-600" />
              <div>
                <h2 className="font-bold text-2xl text-red-600">Payment Failed</h2>
                <p className="mt-2 text-red-600">There was an issue with your payment. Please try again.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CallBack;
