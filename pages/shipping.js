import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

export default function ShippingScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;
  const router = useRouter();

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('phone', shippingAddress.phone);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, phone }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, phone },
    });
    Cookies.set(
      'cart',
      JSON.stringify({ ...cart, shippingAddress: { fullName, address, phone } })
    );
    router.push('/payment');
  };
  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 font-bold text-xl">Shipping Address</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Full Name</label>
          <input
            className="w-full mt-2"
            id="fullName"
            autoFocus
            {...register('fullName', { required: 'Please enter full name' })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="fullName">Address</label>
          <input
            className="w-full mt-2"
            id="address"
            autoFocus
            {...register('address', {
              required: 'Please enter address',
              minLength: { value: 3, message: 'Address is more than 2 chars' },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-8">
          <label htmlFor="fullName">Phone Number</label>
          <input
            className="w-full mt-2"
            id="phone"
            autoFocus
            {...register('phone', {
              required: 'Please enter phone number',
              minLength: {
                value: 10,
                message: 'Phone number is equal to 10 chars',
              },
            })}
          />
          {errors.phone && (
            <div className="text-red-500">{errors.phone.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-center">
          <button className="bg-indigo-700 text-white text-base px-6 py-3 rounded-md flex items-center justify-center w-full">
            <p className="text-white">Next</p>
          </button>
        </div>
      </form>
    </Layout>
  );
}

ShippingScreen.auth = true;
