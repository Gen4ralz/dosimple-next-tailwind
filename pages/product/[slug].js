import React, { useContext, useState, Fragment } from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { Store } from '../../utils/Store';
import { Dialog, Transition } from '@headlessui/react';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ProductScreen(props) {
  //Acess product detail from useRouter hook
  const { product } = props;
  const { state, dispatch } = useContext(Store); // in state -> we have cart and cartItem
  const router = useRouter();

  if (!product) {
    return (
      <Layout title="Product Not Found">
        <div className="justify-center flex">
          <h1 className="py-40">Product Not Found</h1>
        </div>
      </Layout>
    );
  }

  // function add to cart need to use dispatch from StoreProvider for access to the context by useContext function.
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`); // ajax request for check quantity of the product. -> implement product api

    if (data.stock < quantity) {
      return toast.error('Sorry, product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Layout title={product.name}>
        <div className="py-2 mb-4">
          <Link href="/">
            <button className="bg-indigo-700 text-white p-1 font-bold text-xl rounded">
              <p className="px-2">&lt;</p>
            </button>
          </Link>
        </div>
        <div className="grid md:grid-cols-4 md:gap-3">
          <div className="md:col-span-2 mb-4">
            <Image
              src={product.image}
              alt={product.slug}
              width={600}
              height={800}
              Layout="responsive"
              className="rounded-lg"
            />
          </div>
          <div>
            <div className="card p-5">
              <ul>
                <li>
                  <h1 className="text-lg">{product.name}</h1>
                </li>
                <li>
                  <p>
                    {product.rating} of {product.numReviews} reviews
                  </p>
                  <p>{product.description}</p>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className="card p-5">
              <div className="mb-4 flex justify-between">
                <div>Price</div>
                <div>{product.price} Baht</div>
              </div>
              <button
                className={
                  product.stock > 0
                    ? 'primary-button w-full'
                    : 'secondary-button w-full'
                }
                onClick={openModal}
              >
                <p
                  className={product.stock > 0 ? 'text-white' : 'text-red-700'}
                >
                  {product.stock > 0 ? 'Add to cart' : 'Out of stock'}
                </p>
              </button>
            </div>
          </div>
        </div>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            open={isOpen}
            onClose={closeModal}
            className="relative z-10"
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex h-full items-end justify-center text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-t-lg bg-white p-6 text-left align-middle shadow-xl transition-all h-1/2">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-medium leading-6 text-gray-900"
                    >
                      Color
                    </Dialog.Title>
                    {/* <div className="grid grid-cols-3 gap-4 md: grid-cols-2 lg:grid-cols-4"> */}
                    <div className="mt-5">
                      <Image
                        src={product.image}
                        alt={product.slug}
                        width={120}
                        height={150}
                        Layout="responsive"
                        className="rounded-lg"
                      />
                      {/* </div> */}
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 w-full"
                        onClick={addToCartHandler}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return { props: { product: product ? db.convertDocToObj(product) : null } };
}
