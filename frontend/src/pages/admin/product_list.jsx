import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { fetchAllProducts, deleteProduct } from '@/lib/store/features/product/productSlice';
import { Skeleton } from '@/components/ui/skeleton';
import Pagination from '@/components/shop/pagination';
import { ProductFilter } from '@/components/admin/productFilter';

function AdminProductListPage() {
  const dispatch = useDispatch();
  const { productList, isLoading } = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);


  const filteredProducts = productList?.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product._id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || product.category === categoryFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && product.isActive) ||
      (statusFilter === 'inactive' && !product.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  const sortedProducts = filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id === deleteConfirmId ? null : id);
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success('Product deleted successfully');
      dispatch(fetchAllProducts());
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error(error.message || 'Error deleting product');
      setDeleteConfirmId(null);
    }
  };

  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="max-w-8xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Product List</h1>
          <Link
            to="/admin/product"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            Add New Product
          </Link>
        </div>

        <ProductFilter
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {isLoading ? (
          <Skeleton count={5} />
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProducts.map((product) => (
                    <React.Fragment key={product._id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={product.images[0] || '/placeholder-product.jpg'}
                                alt={product.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              {product.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">$ {product.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.totalStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {product.totalStock} in stock
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${product.status === true
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                              }`}
                          >
                            {product.isActive === undefined
                              ? 'Active'
                              : product.isActive
                                ? 'Active'
                                : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                          <Link
                            to={`/admin/product/${product._id}`}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(product._id)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>

                      {deleteConfirmId === product._id && (
                        <tr className="bg-red-50 transition-all duration-300">
                          <td colSpan="6" className="px-6 py-4">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-red-800">
                                Are you sure you want to delete "{product.name}"?
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleDeleteConfirm(product._id)}
                                  className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  <Check size={16} className="mr-1" />
                                  Yes
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(product._id)}
                                  className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                  <X size={16} className="mr-1" />
                                  No
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {sortedProducts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No products found</p>
                </div>
              )}
            </div>

            {sortedProducts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminProductListPage;