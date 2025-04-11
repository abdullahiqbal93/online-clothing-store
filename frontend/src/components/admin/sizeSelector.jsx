import React from 'react';
import { Check } from 'lucide-react';

const SizeSelector = ({ sizes, setSizes, disabled }) => {
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-3 text-gray-700">Available Sizes</label>
      <div className="flex flex-wrap gap-2">
        {sizeOptions.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => toggleSize(size)}
            className={`relative h-10 w-10 rounded-full flex items-center justify-center transition-all ${
              sizes.includes(size)
                ? 'bg-blue-500 text-white ring-2 ring-offset-2 ring-blue-500'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={disabled}
          >
            {size}
            {sizes.includes(size) && (
              <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                <Check size={12} className="text-white" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;