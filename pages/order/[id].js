import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function OrderScreen() {
  const { query } = useRouter();
  const orderId = query.id;
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [orderId, order]);

  const {
    orderItems,
    itemsPrice,
    shippingPrice,
    totalPrice,
    shippingAddress,
    isDelivered,
    isPaid,
    deliveredAt,
    paidAt,
    paymentMethod,
  } = order;

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className="mb-4 text-xl font-bold">
        Order <span className="font-normal">{orderId}</span>
      </h1>
      {loading ? (
        <div>...Loading</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg font-bold">Shipping Address</h2>
              <div>{shippingAddress.fullName}</div>
              <div>{shippingAddress.address}</div>
              <div>{shippingAddress.phone}</div>
              {isDelivered ? (
                <div className="alert-success items-center justify-center flex">
                  Delivered At {deliveredAt}
                </div>
              ) : (
                <div className="alert-error items-center justify-center flex">
                  Not Delivered
                </div>
              )}
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg font-bold">Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success items-center justify-center flex">
                  Paid At {paidAt}
                </div>
              ) : (
                <div className="alert-error items-center justify-center flex">
                  Not Paid
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg font-bold">Order Items</h2>
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200"></ul>
                {orderItems.map((item) => (
                  <li key={item._id} className="flex py-6 md:px-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width="100%"
                        height="100%"
                        className="object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900 px-2">
                          <p className="text-left">{item.name}</p>
                          <p className="ml-4 text-right">{item.price} ฿</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 px-2">Brown</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500 px-2">
                          Qty : {item.quantity}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg font-bold">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>
                      Items ({orderItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                      pcs.)
                    </div>
                    <div>{itemsPrice} ฿</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>{shippingPrice} ฿</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>{totalPrice} ฿</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

OrderScreen.auth = true;

export default OrderScreen;
