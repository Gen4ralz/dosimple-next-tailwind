import React from 'react';
import Link from 'next/link';

export default function ProductItem({ product }) {
  return (
    <div>
      <Link href={`/product/${product.slug}`}>
        <a>
          <img src={product.image} alt={product.name} />
        </a>
      </Link>
      <div className="flex flex-col py-2">
        <p>{product.name}</p>
        <p className="font-bold">{product.price}</p>
      </div>
    </div>
  );
}
