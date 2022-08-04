import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import dynamic from 'next/dynamic';
import { XCircleIcon } from '@heroicons/react/outline';

function CartScreen() {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);
    const { data } = await axios.get(`api/products/${item._id}`);
    if (data.stock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  return (
    <Layout title="Shopping Cart">
      <h1 className="font-bold text-xl mb-10 mt-5 md:px-4">Order Details</h1>
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
        <div>
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {cartItems.map((product) => (
                <li key={product._id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover object-center"
                      width="100%"
                      height="100%"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{product.name}</h3>
                        <p className="ml-4">{product.price} ฿</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Brown</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">
                        Qty :{' '}
                        <select
                          value={product.quantity}
                          onChange={(e) =>
                            updateCartHandler(product, e.target.value)
                          }
                        >
                          {[...Array(product.stock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </p>

                      <div className="flex">
                        <Link href="/cart">
                          <button
                            type="button"
                            onClick={() => removeItemHandler(product)}
                          >
                            <XCircleIcon className="h-6 w-6 text-red-600"></XCircleIcon>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-gray-200 py-6 px-4 sm:px-6 mt-4">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>
                Subtotal : ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                pcs.)
              </p>
              <p>
                {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)} Baht
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => router.push('/login?redirect=/shipping')}
                className="bg-indigo-700 text-white text-base px-6 py-3 rounded-md flex items-center justify-center w-full"
              >
                Checkout
              </button>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                or{' '}
                <Link href="/">
                  <button className="text-indigo-600 font-medium">
                    Continue Shopping <span aria-hidden="true">&rarr;</span>
                  </button>
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
