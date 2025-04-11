import React from 'react';
import { categories } from '@/config';

const CategorySection = ({ handleNavigate }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl text-center font-bold text-gray-800 mb-16">
        Explore Our Collections
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleNavigate(category)}
            className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transform scale-100 lg:group-hover:scale-110 transition-transform duration-500 ease-in-out"
              style={{
                backgroundImage: `url(${category.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black opacity-40 lg:group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>

            <div className="relative p-6 h-80 flex flex-col text-white">
              <p className="text-xl font-bold text-white drop-shadow-lg mb-4">
                {category.label}
              </p>

              <div className="mt-auto transform lg:translate-y-10 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-500 ease-in-out">
                <p className="text-sm text-gray-200 mb-4 drop-shadow-md">
                  {category.description}
                </p>
                <span className="inline-block px-4 py-2 bg-white text-black rounded-full text-xs font-semibold hover:bg-gray-100 transition-colors">
                  Shop Now
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 h-1 bg-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;









