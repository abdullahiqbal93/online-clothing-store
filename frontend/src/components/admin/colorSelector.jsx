import React from 'react';
import { X, Plus } from 'lucide-react';

const ColorSelector = ({ colors, setColors, newColor, setNewColor, disabled }) => {
  const handleAddColor = () => {
    if (newColor.trim() !== '' && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor('');
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setColors(colors.filter((color) => color !== colorToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700">Available Colors</label>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {colors.length > 0 ? (
          colors.map((color) => (
            <div
              key={color}
              className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
            >
              <span className="text-sm">{color}</span>
              <button
                type="button"
                onClick={() => handleRemoveColor(color)}
                className="text-gray-500 hover:text-red-500"
                disabled={disabled}
              >
                <X size={14} />
              </button>
            </div>
          ))
        ) : (
          <span className="text-sm text-gray-500">No colors added yet</span>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a color (e.g., Red, Navy Blue)"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={handleAddColor}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center w-full sm:w-auto"
          disabled={disabled || !newColor.trim()}
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

export default ColorSelector;