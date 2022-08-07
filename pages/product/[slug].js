import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { Store } from '../../utils/Store';
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

  //   // function add to cart need to use dispatch from StoreProvider for access to the context by useContext function.
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

  return (
    <Layout title={product.name}>
      <div className="py-2 mb-4">
        <Link href="/">
          <button className="bg-black text-white p-1 font-bold text-xl rounded">
            <p className="px-1">&lt;</p>
          </button>
        </Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2 mb-4">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={500}
            layout="responsive"
            className="rounded"
          ></Image>
        </div>
        <div>
          <div className="card p-5">
            <ul>
              <li>
                <h1 className="text-lg">{product.name}</h1>
              </li>
              <li>Category: {product.category}</li>
              <li>Brand: {product.brand}</li>
              <li>
                {product.rating} of {product.numReviews} reviews
              </li>
              <li>Description: {product.description}</li>
              <li>Colors: {product.color}</li>
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
              onClick={addToCartHandler}
            >
              <p className={product.stock > 0 ? 'text-white' : 'text-red-700'}>
                {product.stock > 0 ? 'Add to cart' : 'Out of stock'}
              </p>
            </button>
          </div>
        </div>
      </div>
    </Layout>
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
