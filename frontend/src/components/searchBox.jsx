import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { debouncedSearch, clearSearch } from '@/lib/store/features/search/searchSlice';
import { X, Search } from 'lucide-react';

const SearchBox = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { results, suggestions, facets, isLoading, error } = useSelector(state => state.search);

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value.length >= 2) {
      dispatch(debouncedSearch(value, dispatch));
    } else {
      dispatch(clearSearch());
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/shop/product/${productId}`);
    dispatch(clearSearch());
  };

  const handleResultClick = (productId) => {
    navigate(`/shop/product/${productId}`);
    dispatch(clearSearch());
    inputRef.current.value = '';
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex items-center border rounded-full bg-white">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 rounded-full focus:outline-none"
          onChange={handleSearch}
          autoComplete="off"
        />
        <button className="p-2 mr-2">
          {inputRef.current?.value ? (
            <X onClick={() => {
              inputRef.current.value = '';
              dispatch(clearSearch());
            }} />
          ) : (
            <Search />
          )}
        </button>
      </div>

      {(results.length > 0 || suggestions.length > 0) && (
        <div className="absolute top-12 left-0 right-0 bg-white border shadow-lg rounded-lg z-50 max-h-[80vh] overflow-auto">
          {suggestions.length > 0 && (
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold mb-2">Suggestions</h3>
              {suggestions.map((item) => (
                <div
                  key={item._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(item._id)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-semibold mb-2">Products</h3>
              {results.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleResultClick(product._id)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded mr-4"
                  />
                  <div>
                    <div 
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: product.highlights?.map(h => 
                          h.texts.map(t => 
                            t.type === 'hit' ? `<mark>${t.value}</mark>` : t.value
                          ).join('')
                        ).join('...')
                      }}
                    />
                    <div className="text-xs text-gray-500">
                      ${product.price} | {product.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {facets && (
            <div className="p-4 border-t">
              <h3 className="text-sm font-semibold mb-2">Filter by</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-xs font-medium mb-1">Category</h4>
                  {facets.categories.map(cat => (
                    <div key={cat._id} className="flex justify-between text-xs">
                      <span>{cat._id}</span>
                      <span>({cat.count})</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-xs font-medium mb-1">Brand</h4>
                  {facets.brands.map(brand => (
                    <div key={brand._id} className="flex justify-between text-xs">
                      <span>{brand._id}</span>
                      <span>({brand.count})</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-xs font-medium mb-1">Price Range</h4>
                  <div className="text-xs">
                    ${facets.priceRange[0]?.min?.toFixed(2)} - ${facets.priceRange[0]?.max?.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              Loading...
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;