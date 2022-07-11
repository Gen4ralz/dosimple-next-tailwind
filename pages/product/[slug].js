import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import data from '../../utils/data';
import Link from 'next/link';
import Image from 'next/image';
import { Store } from '../../utils/Store';

export default function ProductScreen() {
  //Acess product detail from useRouter hook
  const { state, dispatch } = useContext(Store); // in state -> we have cart and cartItem
  const { query } = useRouter();
  const { slug } = query;
  const product = data.products.find((x) => x.slug === slug);

  if (!product) {
    return (
      <div className="justify-center flex">
        <h1 className="py-40">Product Not Found</h1>
      </div>
    );
  }

  // function add to cart need to use dispatch from StoreProvider for access to the context by useContext function.
  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.stock < quantity) {
      alert('Sorry, product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
  };

  return (
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
            width={1080}
            height={1350}
            Layout="responsive"
            className="rounded-lg"
          />
        </div>
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
            onClick={addToCartHandler}
          >
            <p className={product.stock > 0 ? 'text-white' : 'text-red-700'}>
              {product.stock > 0 ? 'Add to cart' : 'Out of stock'}
            </p>
          </button>
        </div>
      </div>
    </Layout>
  );
}
