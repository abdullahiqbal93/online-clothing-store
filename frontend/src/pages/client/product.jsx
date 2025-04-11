import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import starIcon from "@/assets/star_icon.png";
import starDullIcon from "@/assets/star_dull_icon.png";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import RelatedProducts from "@/components/related_product";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchUserCartItems } from "@/lib/store/features/cart/cartSlice";
import { toast } from "sonner";
import { fetchProductById, fetchAllProducts, deleteReview } from "@/lib/store/features/product/productSlice";
import ReviewForm from "@/components/shop/reviewForm";
import { Pencil, Trash2 } from "lucide-react";

function ProductDetailPage() {
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const { productList, productDetails, isLoading: reviewsLoading } = useSelector((state) => state.product);
  const reviews = productDetails?.reviews || [];
  const averageRating = productDetails?.averageRating || 0;
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("size");
  const [reviewTab, setReviewTab] = useState("description");
  const [editingReview, setEditingReview] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(true);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const product = await dispatch(fetchProductById(productId)).unwrap();
      if (product && product.data) {
        setProductData(product.data);
        setImage(product.data.images[0]);
      }
    } catch (error) {
      toast.error("Error fetching product: " + (error?.message || error?.data));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!user) {
      toast.error("Please login to manage reviews");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const result = await dispatch(deleteReview({
        productId,
        reviewId,
        userId: user.id
      })).unwrap();
      if (result.success) {
        toast.success("Review deleted successfully");
        dispatch(fetchProductById(productId));
      } else {
        toast.error(result.message || "Failed to delete review");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete review");
    }
  };

  const handleReviewSubmitted = () => {
    setEditingReview(null);
    dispatch(fetchProductById(productId));
  };

  const hasVariants = productData && productData.variants && productData.variants.length > 0;

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    if (hasVariants) {
      if (availableSizes.length && !size) {
        toast.error("Please select a size");
        return;
      }
      if (availableColors.length && !color) {
        toast.error("Please select a color");
        return;
      }
    }
    if (productData.variants && productData.variants.length > 0) {
      const variant = productData.variants.find((v) => 
        (!size || v.size === size) && (!color || v.color === color)
      );
      if (!variant || variant.stock === 0) {
        toast.error("Selected variant is not available");
        return;
      }

      const currentCartItem = cartItems.items?.find(
        (item) => item.productId === productId && item.size === size && item.color === color
      );
      const totalQuantity = (currentCartItem?.quantity || 0) + quantity;

      if (totalQuantity > variant.stock) {
        toast.error(`Only ${variant.stock} items available for this variant`);
        return;
      }
    }
    dispatch(
      addToCart({
        userId: user.id,
        productId: productData._id,
        quantity,
        ...(hasVariants && { size, color }),
      })
    )
      .then((response) => {
        if (response.payload?.success) {
          dispatch(fetchUserCartItems(user.id));
          toast.success("Product added to cart");
        } else {
          toast.error("Failed to add product to cart: " + (response.payload?.message || "Insufficient stock"));
        }
      })
      .catch((error) => {
        toast.error("Error adding to cart: " + (error.message || "Please try again"));
      });
  };

  useEffect(() => {
    fetchProductData();
    dispatch(fetchAllProducts());
  }, [productId, dispatch]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500">
      </div>
    </div>;
  if (!productData) return <div className="opacity-0"></div>;
  const availableVariants = hasVariants ? productData.variants.filter((v) => v.stock > 0) : [];
  const availableSizes = hasVariants ? [...new Set(availableVariants.filter((v) => v.size && (!color || v.color === color)).map((v) => v.size))] : [];
  const availableColors = hasVariants ? [...new Set(availableVariants.filter((v) => v.color && (!size || v.size === size)).map((v) => v.color))] : [];
  const getVariantStock = (size, color) => {
    if (!productData.variants || productData.variants.length === 0) {
      return productData.totalStock || 0;
    }
    const variant = productData.variants.find((v) => 
      (!size || v.size === size) && (!color || v.color === color)
    );
    return variant ? variant.stock : 0;
  };

  const isVariantAvailable = (checkSize, checkColor) => {
    if (!productData.variants || productData.variants.length === 0) {
      return productData.totalStock > 0;
    }
    return availableVariants.some((v) => 
      (!checkSize || v.size === checkSize) && (!color || v.color === checkColor)
    );
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity < 1) return;
    if (hasVariants && size && color && newQuantity > getVariantStock(size, color)) {
      toast.error(`Only ${getVariantStock(size, color)} items available`);
      return;
    }
    setQuantity(newQuantity);
  };

  const handleSizeSelect = (sizeOption) => {
    setSize(size === sizeOption ? "" : sizeOption);
  };

  const handleColorSelect = (colorOption) => {
    setColor(color === colorOption ? "" : colorOption);
  };

  const renderStars = (rating) => {
    const roundedRating = Math.round(rating);
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <img
            key={i}
            src={i < roundedRating ? starIcon : starDullIcon}
            alt={i < roundedRating ? "star" : "dull star"}
            className="w-4 h-4"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <Navbar />
      <div className="pt-18 pb-12">
        <div className="relative h-[70vh] overflow-hidden">
          <img
            src={image}
            alt={productData.name}
            className="w-full h-full object-contain opacity-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800/60 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              {productData.name}
            </h1>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {productData.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setImage(img)}
                  className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg border-2 border-gray-300 hover:border-amber-500 cursor-pointer transition-all duration-200"
                  alt={`Thumbnail ${i + 1}`}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 h-[600px] overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                  {renderStars(averageRating)}
                  <span className="ml-2 text-gray-600 text-sm">({reviews.length})</span>
                </div>
                <div className="mb-6">
                  {productData.salePrice ? (
                    <div className="flex items-center gap-4">
                      <p className="text-4xl font-bold text-amber-500">${productData.salePrice}</p>
                      <p className="text-2xl font-medium text-gray-800 line-through">${productData.price}</p>
                    </div>
                  ) : (
                    <p className="text-4xl font-bold text-gray-800">${productData.price}</p>
                  )}
                </div>
                <div className="mb-6">
                  {hasVariants && (
                    <>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {size && (
                          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                            <span>Size: {size}</span>
                            <button onClick={() => setSize("")} className="ml-2 text-gray-500 hover:text-gray-700">×</button>
                          </div>
                        )}
                        {color && (
                          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <span>Color: {color.charAt(0).toUpperCase() + color.slice(1).toLowerCase()}</span>
                            <button onClick={() => setColor("")} className="ml-2 text-gray-500 hover:text-gray-700">×</button>
                          </div>
                        )}
                        {(size || color) && (
                          <button onClick={() => { setSize(""); setColor(""); }} className="text-sm text-gray-500 hover:text-gray-700 underline">
                            Reset all
                          </button>
                        )}
                      </div>
                      <div className="flex border-b mb-4">
                        <button
                          className={`py-2 px-4 font-medium text-sm ${activeTab === "size" ? "border-b-2 border-amber-500 text-amber-500" : "text-gray-500"}`}
                          onClick={() => setActiveTab("size")}
                        >
                          Select Size
                        </button>
                        <button
                          className={`py-2 px-4 font-medium text-sm ${activeTab === "color" ? "border-b-2 border-amber-500 text-amber-500" : "text-gray-500"}`}
                          onClick={() => setActiveTab("color")}
                        >
                          Select Color
                        </button>
                      </div>
                      {activeTab === "size" && (
                        <div className="space-y-3">
                          <div className="text-sm text-gray-500 mb-2">Select your size from the options below</div>
                          <div className="flex flex-wrap gap-2">
                            {availableSizes.map((sizeOption) => {
                              const isSelected = size === sizeOption;
                              const hasVariants = availableColors.some((c) => isVariantAvailable(sizeOption, c));
                              return (
                                <button
                                  key={sizeOption}
                                  onClick={() => handleSizeSelect(sizeOption)}
                                  disabled={!hasVariants}
                                  className={`
                                    py-2 px-4 border rounded text-sm transition-all duration-200
                                    ${isSelected ? "border-amber-500 bg-amber-500 text-white" : "border-gray-300"}
                                    ${!hasVariants ? "opacity-40 cursor-not-allowed" : "hover:border-amber-500"}
                                  `}
                                >
                                  {sizeOption}
                                </button>
                              );
                            })}
                          </div>
                          <div className="text-sm mt-3">
                            {size ? (
                              <button onClick={() => setActiveTab("color")} className="text-amber-500 font-medium underline">
                                Continue to select color →
                              </button>
                            ) : (
                              <span className="text-gray-500">Please select a size to continue</span>
                            )}
                          </div>
                        </div>
                      )}
                      {activeTab === "color" && (
                        <div className="space-y-3">
                          <div className="text-sm text-gray-500 mb-2">Select your preferred color</div>
                          <div className="flex flex-wrap gap-2">
                            {availableColors.map((colorOption) => {
                              const isSelected = color === colorOption;
                              const hasVariants = availableSizes.some((s) => isVariantAvailable(s, colorOption));
                              const displayColor = colorOption.charAt(0).toUpperCase() + colorOption.slice(1).toLowerCase();
                              return (
                                <button
                                  key={colorOption}
                                  onClick={() => handleColorSelect(colorOption)}
                                  disabled={!hasVariants}
                                  className={`
                                    py-2 px-4 border rounded text-sm transition-all duration-200
                                    ${isSelected ? "border-amber-500 bg-amber-500 text-white" : "border-gray-300"}
                                    ${!hasVariants ? "opacity-40 cursor-not-allowed" : "hover:border-amber-500"}
                                  `}
                                >
                                  {displayColor}
                                </button>
                              );
                            })}
                          </div>
                          {!size && (
                            <div className="text-sm mt-3">
                              <button onClick={() => setActiveTab("size")} className="text-amber-500 font-medium underline">
                                ← Go back to select size
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      {size && color && isVariantAvailable(size, color) && getVariantStock(size, color) < 10 && (
                        <div className="mt-4 py-2 px-3 bg-amber-50 text-amber-800 text-sm rounded flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Only {getVariantStock(size, color)} left in stock</span>
                        </div>
                      )}
                    </>                  )}
                  {(hasVariants ? 
                    ((!availableSizes.length || size) && (!availableColors.length || color) && isVariantAvailable(size, color)) 
                    : true) && (
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center bg-gray-100 rounded-full">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          className="px-4 py-2 hover:bg-gray-200 rounded-l-full text-gray-800"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-4 py-2 min-w-10 text-center">{quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(1)}
                          className="px-4 py-2 hover:bg-gray-200 rounded-r-full text-gray-800"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-amber-500 text-white py-3 rounded-full font-semibold hover:bg-amber-600 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart {quantity > 1 && `(${quantity})`}
                      </button>
                    </div>
                  )}
                </div>
                <ul className="mt-6 text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4.5l-3-3 1.5-1.5L9 10.5l4.5-4.5L15 7.5l-6 6z" />
                    </svg>
                    100% Original Product
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4.5l-3-3 1.5-1.5L9 10.5l4.5-4.5L15 7.5l-6 6z" />
                    </svg>
                    Cash on Delivery Available
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4.5l-3-3 1.5-1.5L9 10.5l4.5-4.5L15 7.5l-6 6z" />
                    </svg>
                    Easy 7-Day Return & Exchange
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 h-[600px] flex flex-col">
                <div className="flex border-b border-gray-300">
                  <button
                    className={`px-6 py-3 text-sm font-medium ${reviewTab === "description" ? "text-amber-500 border-b-2 border-amber-500" : "text-gray-600 hover:text-amber-500"}`}
                    onClick={() => setReviewTab("description")}
                  >
                    Description
                  </button>
                  <button
                    className={`px-6 py-3 text-sm font-medium ${reviewTab === "reviews" ? "text-amber-500 border-b-2 border-amber-500" : "text-gray-600 hover:text-amber-500"}`}
                    onClick={() => setReviewTab("reviews")}
                  >
                    Reviews ({reviews.length})
                  </button>
                </div>
                <div className="mt-4 flex-1 overflow-y-auto">
                  {reviewTab === "description" && (
                    <div className="text-gray-600 text-sm leading-relaxed space-y-3">
                      <p>{productData.description}</p>
                    </div>
                  )}
                  {reviewTab === "reviews" && (
                    <div className="flex flex-col h-full">
                      {reviewsLoading ? (
                        <div className="text-center text-gray-500">Loading reviews...</div>
                      ) : reviews.length === 0 ? (
                        <div className="text-center text-gray-500 flex-1">No reviews yet. Be the first to review!</div>
                      ) : (
                        <div className="space-y-4 flex-1 overflow-y-auto border-b pb-4">
                          {reviews.map((review) => (
                            <div key={review._id} className="pb-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{review.name}</span>
                                  {renderStars(review.reviewValue)}
                                </div>
                                {user && user.id === review.userId && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setEditingReview(review)}
                                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                      <Pencil size={16} className="text-gray-500" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteReview(review._id)}
                                      className="p-1 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                      <Trash2 size={16} className="text-red-500" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mt-1">{review.reviewMessage}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                              {editingReview && editingReview._id === review._id && (
                                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Edit Your Review</h4>
                                  <ReviewForm
                                    productId={productId}
                                    userId={user.id}
                                    userName={user.name}
                                    onReviewSubmitted={handleReviewSubmitted}
                                    existingReview={editingReview}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {user && reviewTab === "reviews" && !editingReview && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
                          <ReviewForm
                            productId={productId}
                            userId={user.id}
                            userName={user.name}
                            onReviewSubmitted={handleReviewSubmitted}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <RelatedProducts
          products={productList}
          category={productData.category}
          brand={productData.brand}
          handleAddToCart={handleAddToCart}
        />
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetailPage;