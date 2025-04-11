import React from 'react';
import ProductCard from '@/components/product_card';
import { categories } from '@/config';

const NewArrivalsSection = ({ selectedCategory, setSelectedCategory, newArrivalProducts }) => {
  return (
    <div className="container mx-auto p-6 w-full">
      <h1 className="text-4xl text-center font-bold mt-12">New Arrivals</h1>      <div className="flex justify-center gap-6 mt-6 flex-wrap mb-6">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-4 py-2 font-semibold ${selectedCategory === category.name ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4 p-4">
        {newArrivalProducts.map((product, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-64" 
          >
            <ProductCard item={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivalsSection;