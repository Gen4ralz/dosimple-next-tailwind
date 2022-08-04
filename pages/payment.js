import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

export default function PaymentScreen() {
  const [selectedPayment, setSelectedPayment] = useState('');
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;
  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPayment) {
      return toast.error('Payment method is required');
    }
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPayment });
    Cookies.set(
      'cart',
      JSON.stringify({ ...cart, paymentMethod: { selectedPayment } })
    );
    router.push('/placeorder');
  };
  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push('/shipping');
    }
    setSelectedPayment(paymentMethod || '');
  }, [paymentMethod, shippingAddress.address, router]);
  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <div className="mb-4">
        <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
          <h1 className="text-xl mb-4 font-bold">Payment Method</h1>
          {['PayPal', 'Crypto', 'Bank Transfer', 'Cash On Delivery'].map(
            (payment) => (
              <div key={payment} className="mb-4">
                <input
                  className="p-2 outline:none focus:ring-0"
                  name="paymentMethod"
                  id={payment}
                  type="radio"
                  checked={selectedPayment === payment}
                  onChange={() => setSelectedPayment(payment)}
                />
                <label className="p-2" htmlFor={payment}>
                  {payment}
                </label>
              </div>
            )
          )}
          <div className="mb-4 flex justify-between px-4">
            <button
              onClick={() => router.push('/shipping')}
              className="bg-black text-white text-base px-6 py-3 rounded-md flex items-center"
              type="button"
            >
              Back
            </button>
            <button className="bg-indigo-700 text-white text-base px-6 py-3 rounded-md flex items-center">
              Next
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

PaymentScreen.auth = true;
