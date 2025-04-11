import React, { useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '@/lib/store/features/wishlist/wishlistSlice';
import { toast } from 'sonner';
function ProductCard({ item }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { items: wishlist } = useSelector((state) => state.wishlist);

  const reviews = item.reviews || [];
  const averageRating = item.averageRating || 0;
  const isInWishlist = wishlist.some(wishlistItem => wishlistItem._id === item._id);


  const handleWishlistToggle = () => {
    if (!user?.id) {
      toast.error('Please log in to manage your wishlist');
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist({
        userId: user.id,
        productId: item._id
      }))
        .unwrap()
        .then(() => toast.success('Removed from wishlist'))
        .catch((error) => toast.error(error || 'Failed to remove from wishlist'));
    } else {
      dispatch(addToWishlist({
        userId: user.id,
        productId: item._id
      }))
        .unwrap()
        .then(() => toast.success('Added to wishlist'))
        .catch((error) => toast.error(error || 'Failed to add to wishlist'));
    }
  };

  const renderStars = (rating) => {
    const roundedRating = Math.round(rating);
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-sm ${i < roundedRating ? "text-amber-500" : "text-gray-300"
              }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">({reviews.length})</span>
      </div>
    );
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {item.salePrice && (
        <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium px-2.5 py-1 rounded-full z-10">
          Sale
        </span>
      )}

      <div
        className="relative cursor-pointer overflow-hidden"
        onClick={() => navigate(`/shop/product/${item._id}`)}
      >
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-80 object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={() => {
              navigate(`/shop/product/${item._id}`);
            }}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div
          className="cursor-pointer"
          onClick={() => navigate(`/shop/product/${item._id}`)}
        >
          <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{item.brand || 'No Brand'}</p>
          <div className="mt-2">{renderStars(averageRating)}</div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          {item.salePrice ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-red-600">${item.salePrice}</span>
              <span className="text-sm text-gray-400 line-through">${item.price}</span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900">${item.price}</span>
          )}

          <button
            onClick={handleWishlistToggle}
            className={`p-1 rounded-full transition-colors ${isInWishlist
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-400 hover:text-red-500'
              }`}
          >
            <Heart
              className="w-6 h-6"
              fill={isInWishlist ? 'currentColor' : 'none'}
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;