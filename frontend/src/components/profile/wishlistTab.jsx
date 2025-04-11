import React, { useState } from 'react';
import { Heart, Trash2, Loader2, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist } from '@/lib/store/features/wishlist/wishlistSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function WishlistTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [removingItemId, setRemovingItemId] = useState(null);
  const { items: wishlist, isLoading, error } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.user);

  const handleRemoveFromWishlist = (productId) => {
    if (!user?.id) {
      toast.error('Please log in to manage your wishlist');
      return;
    }
    setRemovingItemId(productId);
    dispatch(removeFromWishlist({ userId: user.id, productId })).unwrap()
      .then(() => {
        toast.success('Item removed from wishlist');
      })
      .catch((error) => {
        toast.error(error || 'Failed to remove item from wishlist');
      })
      .finally(() => {
        setRemovingItemId(null);
      });
  };

  const handleViewProduct = (productId) => {
    navigate(`/shop/product/${productId}`);
  };

  if (isLoading && !removingItemId) {
    return <div className="text-center py-8">Loading wishlist...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-medium mb-6">My Wishlist</h2>
      {wishlist && wishlist.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <div key={item._id} className="border rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded" 
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-900 font-medium mt-1">
                      {item.salePrice ? (
                        <>
                          <span className="text-red-500">${item.salePrice}</span>{' '}
                          <span className="line-through text-gray-400">${item.price}</span>
                        </>
                      ) : (
                        `$${item.price}`
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleViewProduct(item._id)}
                    className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> View Product
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    disabled={removingItemId === item._id}
                    className="flex-1 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {removingItemId === item._id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Removing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" /> Remove
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-gray-500">Start saving items you love.</p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => navigate("/shop/listing")}
            >
              Browse Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WishlistTab;