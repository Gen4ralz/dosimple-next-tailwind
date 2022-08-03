import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';

export default function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;
  const router = useRouter();
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  const shippingPrice = 0;
  const totalPrice = round2(itemsPrice + shippingPrice);
  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
  }, [paymentMethod, router]);
  const [loading, setLoading] = useState(false);
  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({ type: 'CLEAR_CART_ITEMS' });
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />
      <h1 className="text-xl font-bold mb-4">Place Order</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty.{' '}
          <Link href="/">
            <button className="bg-indigo-700 text-white p-1 rounded">
              Go Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg font-bold">Shipping Address</h2>
              <div>{shippingAddress.fullName}</div>
              <div>{shippingAddress.address}</div>
              <div>{shippingAddress.phone}</div>
              <div>
                <button
                  onClick={() => router.push('/shipping')}
                  className="bg-black text-white text-base px-2 py-1 rounded-md flex items-center mt-2"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg font-bold">Payment Method</h2>
              <div>{paymentMethod}</div>
              <div>
                <button
                  onClick={() => router.push('/payment')}
                  className="bg-black text-white text-base px-2 py-1 rounded-md flex items-center mt-2"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg font-bold">Order Items</h2>
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200"></ul>
                {cartItems.map((item) => (
                  <li key={item.slug} className="flex py-6 md:px-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <Link href={`/product/${item.slug}`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width="100%"
                          height="100%"
                          className="object-center"
                        />
                      </Link>
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900 px-2">
                          <p className="text-left">{item.name}</p>
                          <p className="ml-4 text-right">{item.price} ฿</p>
                        </div>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500 px-2">
                          Qty : {item.quantity}
                        </p>
                        <div className="flex">
                          <button
                            type="button"
                            className="bg-black text-white text-base px-2 py-1 rounded-md flex items-center mt-2"
                            onClick={() => router.push('/cart')}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg font-bold">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>
                      Items ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
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
                <li>
                  <button
                    disabled={loading}
                    className="bg-indigo-700 text-white text-base px-6 py-3 rounded-md flex items-center w-full justify-center"
                    onClick={placeOrderHandler}
                  >
                    {loading ? 'Loading' : 'Place Order'}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

PlaceOrderScreen.auth = true;
