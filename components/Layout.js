import Head from 'next/head';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { Store } from '../utils/Store';
import { ToastContainer } from 'react-toastify';
import { useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);
  return (
    <>
      <Head>
        <title>{title ? title + ' - Dosimple' : 'Dosimple'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="top-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-14 justify-between shadow-md items-center px-4 bg-black">
            <Link href="/">
              <a className="text-2xl font-bold text-white px-4">Dosimple</a>
            </Link>
            <div>
              <Link href="/cart">
                <a className="p-2 text-white">
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs text-white font-bold">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <span className="text-white px-4 font-bold">
                  {session.user.name}
                </span>
              ) : (
                <Link href="/login">
                  <a className="p-2 text-white">Login</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
      </div>
    </>
  );
}
