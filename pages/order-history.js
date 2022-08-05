import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import PlaceOrderScreen from './placeorder';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function OrderHistoryScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);

  return (
    <Layout title="Order History">
      <h1 className="mb-2 text-xl font-bold px-2">Your Orders</h1>
      <p className="mb-6 text-xs text-gray-500 px-2">
        Check the status of recent orders, manage returns, and discover similar
        products.
      </p>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="flow-root">
          <ul role="list" className="-my-6 divide-y divide-gray-200 mt-4"></ul>
          {orders.map((item) => (
            <li key={item._id} className="flex md:px-4">
              <div className="card w-full">
                <p className="p-2 font-bold">
                  Order #{item._id.substring(20, 24)}
                </p>
                <p className="px-2 text-gray-500">
                  Create On: {item.createdAt.substring(0, 10)}
                </p>
                <p className="px-2 text-gray-500">Total: {item.totalPrice} ฿</p>
                <div className="flex">
                  {item.isPaid ? (
                    <div className="alert-success items-center justify-center flex mx-2 text-sm">
                      Paid: {item.paidAt.substring(0, 10)}
                    </div>
                  ) : (
                    <div className="alert-error items-center justify-center flex mx-2 text-sm">
                      Not Paid
                    </div>
                  )}
                  {item.isDelivered ? (
                    <div className="alert-success items-center justify-center flex text-sm">
                      {item.deliveredAt.substring(0, 10)}
                    </div>
                  ) : (
                    <div className="alert-error items-center justify-center flex mx-2 text-sm">
                      Not Delivered
                    </div>
                  )}
                  <div className="p-3">
                    <Link href={`/order/${item._id}`} passHref>
                      <a className="bg-black text-white text-base px-2 py-3 rounded-md flex items-right text-sm">
                        Details
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </div>
      )}
    </Layout>
  );
}

OrderHistoryScreen.auth = true;
export default OrderHistoryScreen;
