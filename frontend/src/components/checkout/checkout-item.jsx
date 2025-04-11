import React from 'react';

const CheckoutItem = ({ item, variant = 'default' }) => {  return (
    <div className="flex items-center gap-4">
      <img
        src={item.images[0]}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      <div>
        <p className="font-medium text-gray-800">{item.name}</p>
        <p className="text-sm text-gray-600">
          {item.quantity} × ${(item.salePrice || item.price).toFixed(2)}
        </p>
        {variant === 'detailed' && item.size && item.color && (
          <p className="text-xs text-gray-500 mt-1">
            {item.size} · {item.color}
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckoutItem;
