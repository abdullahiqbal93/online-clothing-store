import React, { useEffect } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartItemQuantity } from "@/lib/store/features/cart/cartSlice";
import { fetchAllProducts } from "@/lib/store/features/product/productSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.user);
  const { productList, isLoading } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    if (productList.length === 0) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, productList.length]);
  const product = productList.find((p) => p._id === cartItem.productId);
  const variant = product?.variants?.length > 0 ? 
    product.variants.find(v => 
      (!cartItem.size || v.size === cartItem.size) && 
      (!cartItem.color || v.color === cartItem.color)
    ) : 
    { stock: product?.totalStock };

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (!product || !variant) {
      toast.error("This variant is no longer available");
      return;
    }

    const availableStock = variant.stock || 0;
    const newQuantity =
      typeOfAction === "plus" ? getCartItem.quantity + 1 : getCartItem.quantity - 1;

    if (typeOfAction === "plus" && newQuantity > availableStock) {
      toast.error(`Only ${availableStock} items available for this size and color`);
      return;
    }

    if (newQuantity <= 0) return;

    dispatch(
      updateCartItemQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        size: getCartItem?.size,
        color: getCartItem?.color,
        quantity: newQuantity,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart item updated successfully");
      } else {
        toast.error("Failed to update cart item");
      }
    }).catch((error) => {
      toast.error(error.data || "An error occurred while updating the cart");
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({
        userId: user?.id,
        productId: getCartItem?.productId,
        size: getCartItem?.size,
        color: getCartItem?.color,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart item deleted successfully");
      } else {
        toast.error("Failed to delete cart item");
      }
    }).catch((error) => {
      toast.error(error.data || "An error occurred while deleting the cart item");
    });
  }

  if (isLoading && !product) {
    return (
      <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-blue-600">Loading product information...</h3>
          <p className="text-xs text-gray-500 mt-1">
            Please wait while we fetch the latest product data.
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg border border-red-100">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-red-600">Product no longer available</h3>
          <p className="text-xs text-gray-500 mt-1">
            This product has been removed from our catalog.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => handleCartItemDelete(cartItem)}
        >
          <Trash2 size={18} />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    );
  }

  if (!variant) {
    return (
      <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-yellow-600">Variant no longer available</h3>
          <p className="text-xs text-gray-500 mt-1">
            Size: {cartItem?.size}, Color: {cartItem?.color}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            This variant has been removed. Please delete it from your cart.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => handleCartItemDelete(cartItem)}
        >
          <Trash2 size={18} />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    );
  }
  
  if (variant.stock === 0) {
    return (
      <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-orange-600">Product sold out</h3>
          <p className="text-xs text-gray-500 mt-1">
            Size: {cartItem?.size}, Color: {cartItem?.color}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            This item is currently out of stock. Please remove it from your cart.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => handleCartItemDelete(cartItem)}
        >
          <Trash2 size={18} />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-100">
      <div className="h-24 w-24 bg-gray-50 rounded-md overflow-hidden flex-shrink-0 relative">
        <img
          src={cartItem?.images?.[0] || "/placeholder-image.jpg"}
          alt={cartItem?.name || "Product"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{cartItem?.name}</h3>
        <p className="text-xs text-gray-500 mt-1">
          {cartItem?.size} · {cartItem?.color}
        </p>

        <div className="flex items-center mt-3">
          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden h-8">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              disabled={cartItem?.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="w-3 h-3" />
              <span className="sr-only">Decrease</span>
            </Button>
            <span className="w-8 text-center text-sm font-medium">{cartItem?.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-3 h-3" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className="font-medium text-gray-900">
          ${(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity
          ).toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </p>
        {cartItem?.salePrice > 0 && (
          <p className="text-xs text-gray-500 line-through mt-1">
            ${(cartItem?.price * cartItem?.quantity).toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </p>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-red-500 hover:bg-transparent mt-3"
          onClick={() => handleCartItemDelete(cartItem)}
        >
          <Trash2 size={16} />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;