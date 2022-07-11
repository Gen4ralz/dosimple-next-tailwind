import React from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import data from '../../utils/data';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductScreen() {
  //Acess product detail from useRouter hook
  const { query } = useRouter();
  const { slug } = query;
  const product = data.products.find((x) => x.slug === slug);
  if (!product) {
    return (
      <Layout>
        <div className="justify-center flex">
          <h1 className="py-40">Product Not Found</h1>
        </div>
      </Layout>
    );
  }
  return (
    <Layout title={product.name}>
      <div className="py-2 mb-4">
        <Link href="/">
          <button className="bg-green-100 p-1 rounded">Back to products</button>
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
