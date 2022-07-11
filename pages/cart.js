import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

export default function CartScreen() {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const {
    cart: { cartItems },
  } = state;
  const updateCartHandler = (item, qty) => {
    const quantity = Number(qty);
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
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
                      <p>{item.name}</p>
                      <p className="ml-4">{item.price} Baht</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 px-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-gray-500 px-2">
                      Qty :{' '}
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.stock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </p>
                    <div className="flex">
                      <button
                        type="button"
                        className="font-medium text-indigo-600 px-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </div>
          <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>
                Subtotal : ({cartItems.reduce((a, c) => a + c.quantity, 0)})
              </p>
              <p>
                {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)} Baht
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => router.push('/shipping')}
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
