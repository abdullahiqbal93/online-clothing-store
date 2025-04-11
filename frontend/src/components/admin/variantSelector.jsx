import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

const VariantSelector = ({ variants, setVariants, disabled }) => {
  const [newVariant, setNewVariant] = useState({ size: '', color: '', stock: '' });

  const handleAddVariant = () => {
    const { size, color, stock } = newVariant;
    if ((!size && !color) || stock === '' || stock < 0) {
      toast.error('Provide at least size or color, and valid stock');
      return;
    }

    const variantExists = variants.some(
      (v) =>
        (v.size || '') === (size || '') &&
        (v.color || '') === (color || '')
    );
    if (variantExists) {
      toast.error('Variant already exists');
      return;
    }

    setVariants([
      ...variants,
      {
        size: size || '',
        color: color || '',
        stock: parseInt(stock),
      },
    ]);
    setNewVariant({ size: '', color: '', stock: '' });
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700">Variants</label>
      <div className="space-y-2 mb-3">
        {variants.length > 0 ? (
          variants.map((variant, index) => (
            <div
              key={index}
              className="bg-gray-100 p-2 rounded-lg flex items-center justify-between"
            >
              <span className="text-sm">
                {variant.size && `Size: ${variant.size}`} {variant.color && `Color: ${variant.color}`} | Stock: {variant.stock}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveVariant(index)}
                className="text-gray-500 hover:text-red-500"
                disabled={disabled}
              >
                <X size={14} />
              </button>
            </div>
          ))
        ) : (
          <span className="text-sm text-gray-500">No variants added yet</span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          type="text"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Size (e.g., XL)"
          value={newVariant.size}
          onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
          disabled={disabled}
        />
        <input
          type="text"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Color (e.g., Red)"
          value={newVariant.color}
          onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
          disabled={disabled}
        />
        <input
          type="number"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Stock"
          min="0"
          value={newVariant.stock}
          onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
          disabled={disabled}
        />
      </div>
      <button
        type="button"
        onClick={handleAddVariant}
        className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center w-full sm:w-auto"
        disabled={
          disabled ||
          (!newVariant.size && !newVariant.color) ||
          newVariant.stock === '' ||
          newVariant.stock < 0
        }
      >
        <Plus size={18} /> Add Variant
      </button>
    </div>
  );
};

export default VariantSelector;
