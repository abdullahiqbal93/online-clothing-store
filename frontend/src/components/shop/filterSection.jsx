import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { categoryList } from '@/config';

const FilterSection = ({ brands, filters = {}, handleFilter }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [showCategory, setShowCategory] = useState(true);
  const [showBrand, setShowBrand] = useState(true);
  const [brandSearch, setBrandSearch] = useState('');

  return (
    <div className="min-w-60 bg-white rounded-lg shadow-sm sm:shadow-none">
      <div 
        onClick={() => setShowFilter(!showFilter)}
        className="p-4 bg-gray-50 rounded-t-lg sm:bg-transparent cursor-pointer flex justify-between items-center"
      >
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <ChevronDown 
          className={`h-5 w-5 transform transition-transform sm:hidden ${
            showFilter ? 'rotate-180' : ''
          }`}
        />
      </div>

      <div className={`space-y-4 p-4 ${showFilter ? '' : 'hidden'} sm:block`}>
        <div className="border-b border-gray-200 pb-4">
          <div 
            onClick={() => setShowCategory(!showCategory)}
            className="flex justify-between items-center cursor-pointer mb-2"
          >
            <h4 className="text-base font-medium text-gray-900">Categories</h4>
            <ChevronDown
              className={`h-5 w-5 text-gray-500 transition-transform ${
                showCategory ? 'rotate-180' : ''
              }`}
            />
          </div>
          {showCategory && (
            <div className="space-y-2 mt-2">
              {categoryList.map((category) => (
                <label 
                  key={category} 
                  className="flex items-center space-x-3 group hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      value={category}
                      checked={filters?.category?.includes(category) || false}
                      onChange={() => handleFilter('category', category)}
                      className="absolute opacity-0 h-0 w-0"
                    />
                    <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all
                      ${filters?.category?.includes(category) 
                        ? 'border-blue-600 bg-blue-600' 
                        : 'border-gray-300 group-hover:border-blue-400'}
                    `}>
                      <Check 
                        className={`w-4 h-4 text-white transition-opacity 
                          ${filters?.category?.includes(category) ? 'opacity-100' : 'opacity-0'}
                        `}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-700">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 pb-4">
          <div 
            onClick={() => setShowBrand(!showBrand)}
            className="flex justify-between items-center cursor-pointer mb-2"
          >
            <h4 className="text-base font-medium text-gray-900">Brands</h4>
            <ChevronDown
              className={`h-5 w-5 text-gray-500 transition-transform ${
                showBrand ? 'rotate-180' : ''
              }`}
            />
          </div>
          {showBrand && brands.length > 0 && (
            <div className="space-y-2 mt-2">
              <input
                type="text"
                placeholder="Search brands..."
                onChange={(e) => setBrandSearch(e.target.value)}
                className="w-full p-1 text-sm border border-gray-300 rounded-lg mb-2"
              />
              <div className="max-h-72 overflow-y-auto">
                {brands
                  .filter((brand) =>
                    brand.toLowerCase().includes(brandSearch.toLowerCase())
                  )
                  .map((brand) => (
                    brand && brand.toLowerCase() !== 'no brand' && (
                      <label 
                        key={brand} 
                        className="flex items-center space-x-3 group hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            value={brand}
                            checked={filters?.brand?.includes(brand) || false}
                            onChange={() => handleFilter('brand', brand)}
                            className="absolute opacity-0 h-0 w-0"
                          />
                          <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all
                            ${filters?.brand?.includes(brand) 
                              ? 'border-blue-600 bg-blue-600' 
                              : 'border-gray-300 group-hover:border-blue-400'}
                          `}>
                            <Check 
                              className={`w-4 h-4 text-white transition-opacity 
                                ${filters?.brand?.includes(brand) ? 'opacity-100' : 'opacity-0'}
                              `}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-gray-700">{brand}</span>
                      </label>
                    )
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;