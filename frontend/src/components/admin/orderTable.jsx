import React, { useState } from 'react';
import { Trash2, Check, X, Eye } from 'lucide-react';
import OrderDetailModal from '@/components/admin/orderDetailModal';

const OrderTable = ({ orders, handleUpdateStatus, handleDeleteOrder, handleSoftDeleteOrder, isSuperAdmin }) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [softDeleteConfirmId, setSoftDeleteConfirmId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id === deleteConfirmId ? null : id);
  };

  const handleSoftDeleteClick = (id) => {
    setSoftDeleteConfirmId(id === softDeleteConfirmId ? null : id);
  };

  const handleDeleteConfirm = (id) => {
    handleDeleteOrder(id);
    setDeleteConfirmId(null);
  };

  const handleSoftDeleteConfirm = (id) => {
    handleSoftDeleteOrder(id);
    setSoftDeleteConfirmId(null);
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full lg:min-w-[1200px] divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">Customer ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">Customer Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">Payment Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">Order Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                  No orders found matching the filters
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 w-[150px]">{order._id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 w-[120px]">{order.userId || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 w-[150px]">{order.user?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 w-[200px]">{order.user?.email || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 w-[100px]">${order.totalAmount}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 w-[120px]">{order.paymentStatus || 'pending'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 w-[120px]">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 w-[200px]">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className="px-1 py-1 border rounded-md text-sm w-full min-w-[150px] text-gray-900 whitespace-nowrap"
                        title={order.orderStatus}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 flex space-x-2 w-[150px]">
                      <button
                        onClick={() => handleViewOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      {!order.deletedFor?.admin && (
                        <button
                          onClick={() => handleSoftDeleteClick(order._id)}
                          className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50"
                          title="Hide Order"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleDeleteClick(order._id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                          title="Permanently Delete Order"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                  {softDeleteConfirmId === order._id && (
                    <tr className="bg-gray-50 transition-all duration-300">
                      <td colSpan="9" className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-800">
                            Are you sure you want to delete order "{order._id}"?
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSoftDeleteConfirm(order._id)}
                              className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <Check size={16} className="mr-1" />
                              Yes
                            </button>
                            <button
                              onClick={() => handleSoftDeleteClick(order._id)}
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
                  {deleteConfirmId === order._id && (
                    <tr className="bg-red-50 transition-all duration-300">
                      <td colSpan="9" className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-red-800">
                            Are you sure you want to permanently delete order "{order._id}"?
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteConfirm(order._id)}
                              className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <Check size={16} className="mr-1" />
                              Yes
                            </button>
                            <button
                              onClick={() => handleDeleteClick(order._id)}
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
              ))
            )}
          </tbody>
        </table>
      </div>
      {isDetailModalOpen && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
        />
      )}
    </>
  );
};

export default OrderTable;