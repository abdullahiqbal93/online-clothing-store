import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addNewProduct, editProduct, fetchAllProducts } from '@/lib/store/features/product/productSlice';
import ImageUploader from '@/components/admin/imageUploader';
import VariantSelector from '@/components/admin/variantSelector';
import { categoryList } from '@/config';

function AdminProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList } = useSelector((state) => state.product);
  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('men');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [variants, setVariants] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const isEditMode = !!id;

  useEffect(() => {
    const calculatedStock = variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);
    setTotalStock(calculatedStock);
  }, [variants]);

  useEffect(() => {
    if (isEditMode) {
      const product = productList.find((p) => p._id === id);
      if (product) {
        setName(product.name);
        setDescription(product.description);
        setCategory(product.category);
        setBrand(product.brand || '');
        setPrice(product.price.toString());
        setSalePrice(product.salePrice?.toString() || '');
        setVariants(product.variants || []);
        setTotalStock(product.totalStock || 0);
        setIsActive(product.isActive === undefined ? true : product.isActive);
        const existingImages = product.images || [];
        setImages({
          image1: existingImages[0] || null,
          image2: existingImages[1] || null,
          image3: existingImages[2] || null,
          image4: existingImages[3] || null,
          image5: existingImages[4] || null,
        });
      }
    } else {
      resetForm();
    }
  }, [id, productList, isEditMode]);

  const handleImageChange = (e, imageKey) => {
    if (e.target.files[0]) {
      setImages((prev) => ({
        ...prev,
        [imageKey]: e.target.files[0],
      }));
    }
  };

  const removeImage = (imageKey) => {
    setImages((prev) => ({
      ...prev,
      [imageKey]: null,
    }));
  };

  const resetForm = () => {
    setImages({ image1: null, image2: null, image3: null, image4: null, image5: null });
    setName('');
    setDescription('');
    setCategory('men');
    setBrand('');
    setPrice('');
    setSalePrice('');
    setVariants([]);
    setTotalStock(0);
    setIsActive(true);
  };

  const validateForm = () => {
    if (!name.trim()) return 'Product name is required';
    if (!description.trim()) return 'Product description is required';
    if (!price || price <= 0) return 'Valid price is required';
    if (!Object.values(images).some(img => img !== null)) return 'At least one image is required';
    if (variants.length === 0) return 'At least one variant is required';
    const isVariantValid = variants.every(
      (v) =>
        ((v.size && !v.color) || (!v.size && v.color) || (v.size && v.color)) &&
        v.stock >= 0
    );
    if (!isVariantValid) return 'Each variant must have at least one of size or color, and valid stock';
    return null;
  };
  
  
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const validationError = validateForm();
    if (validationError) {
      setLoading(false);
      toast.error(validationError);
      return;
    }
  
    const formData = new FormData();
    const existingImages = Object.values(images).filter(
      (img) => img !== null && typeof img === 'string'
    );
  
    if (isEditMode) {
      formData.append('existingImages', JSON.stringify(existingImages));
    }
  
    Object.entries(images).forEach(([key, image]) => {
      if (image instanceof File) {
        formData.append('images', image);
      }
    });
  
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('brand', brand);
    formData.append('price', price);
    formData.append('salePrice', salePrice);
    formData.append('totalStock', totalStock.toString());
    formData.append('isActive', isActive);
  
    variants.forEach((variant, index) => {
      formData.append(`variants[${index}][size]`, variant.size);
      formData.append(`variants[${index}][color]`, variant.color);
      formData.append(`variants[${index}][stock]`, variant.stock.toString());
    });
  
    try {
      let result;
      if (isEditMode) {
        result = await dispatch(editProduct({ id, formData })).unwrap();
      } else {
        result = await dispatch(addNewProduct(formData)).unwrap();
      }
      if (result?.success) {
        dispatch(fetchAllProducts());
        toast.success(`Product ${isEditMode ? 'Updated' : 'Added'} successfully`);
        if (!isEditMode) resetForm();
        else navigate('/admin/productList');
      } else {
        throw new Error(result?.message || 'Operation failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
      toast.error(`${isEditMode ? 'Update' : 'Add'} failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <form className="space-y-6 sm:space-y-8" onSubmit={onSubmitHandler}>
          <ImageUploader
            images={images}
            handleImageChange={handleImageChange}
            removeImage={removeImage}
            disabled={loading}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 sm:mb-2 text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  disabled={loading}
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-1 sm:mb-2 text-gray-700"
                >
                  Product Description
                </label>
                <textarea
                  id="description"
                  required
                  rows="4"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter detailed product description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="isActive" className="block text-sm font-medium mb-1 sm:mb-2 text-gray-700">
                  Product Status
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      name="isActive"
                      checked={isActive === true}
                      onChange={() => setIsActive(true)}
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Active
                      <span className="ml-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Visible to customers
                      </span>
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      name="isActive"
                      checked={isActive === false}
                      onChange={() => setIsActive(false)}
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Inactive
                      <span className="ml-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Hidden from store
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium mb-1 sm:mb-2 text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    className="w-full px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                    disabled={loading}
                  >                    {categoryList.map(category => (
                      <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium mb-1 sm:mb-2 text-gray-700"
                  >
                    Brand
                  </label>
                  <input
                    type="text"
                    id="brand"
                    className="w-full px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter brand name"
                    onChange={(e) => setBrand(e.target.value)}
                    value={brand}
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1 sm:mb-2 text-gray-700">
                  Price ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="salePrice" className="block text-sm font-medium mb-1 sm:mb-2 text-gray-700">
                  Sale Price ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="salePrice"
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    onChange={(e) => setSalePrice(e.target.value)}
                    value={salePrice}
                    disabled={loading}
                  />
                </div>
              </div>
              <VariantSelector variants={variants} setVariants={setVariants} disabled={loading} />
            </div>
          </div>
          <div className="pt-2 sm:pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 sm:px-6 w-full py-2 sm:py-3 rounded-lg text-white font-medium transition-all ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading
                ? isEditMode
                  ? 'Updating Product...'
                  : 'Adding Product...'
                : isEditMode
                ? 'Update Product'
                : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminProductPage;