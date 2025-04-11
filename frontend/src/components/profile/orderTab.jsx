import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cancelOrder, deleteOrderForUser, getAllOrdersByUserId } from '@/lib/store/features/order/orderSlice';
import { ShoppingBag, Trash2, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrderDetailsModal from '@/components/profile/orderDetailsModal'; 

function OrdersTab({ orderList, loading }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('All');
  const [cancelConfirmId, setCancelConfirmId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); 

  const { user } = useSelector((state) => state.user);

  const handleCancelClick = (orderId, e) => {
    e.stopPropagation();
    setCancelConfirmId(cancelConfirmId === orderId ? null : orderId);
  };

  const handleCancelConfirm = async (orderId, e) => {
    e.stopPropagation();
    try {
      await dispatch(cancelOrder(orderId)).unwrap();
      setCancelConfirmId(null);
      dispatch(getAllOrdersByUserId(user?.id));
    } catch (error) {
      alert(`Failed to cancel the order: ${error}`);
    }
  };

  const handleDeleteClick = (orderId, e) => {
    e.stopPropagation();
    setDeleteConfirmId(deleteConfirmId === orderId ? null : orderId);
  };

  const handleDeleteConfirm = async (orderId, e) => {
    e.stopPropagation();
    try {
      await dispatch(deleteOrderForUser(orderId)).unwrap();
      setDeleteConfirmId(null);
      dispatch(getAllOrdersByUserId(user?.id));
    } catch (error) {
      alert(`Failed to delete the order: ${error}`);
    }
  };

  const filteredOrders = filterStatus === 'All'
    ? [...orderList].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    : [...orderList]
        ?.filter((order) => order.orderStatus === filterStatus.toLowerCase())
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)) || [];

  if (loading) {
    return <div className="text-center py-8"><p className="text-gray-500">Loading orders...</p></div>;
  }

  const statusOptions = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">My Orders</h2>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-40 rounded-md border border-gray-300 py-2 px-3"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const canCancel = ['pending', 'confirmed'].includes(order.orderStatus);
            const canDelete = ['delivered', 'cancelled'].includes(order.orderStatus);

            return (
              <div key={order._id} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.orderStatus === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.orderStatus === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="px-4 py-2">
                  <div className="mt-4 flex justify-between items-center">
                    <p className="font-medium">
                      Total Amount: <span className="text-lg">${order.totalAmount.toFixed(2)}</span>
                    </p>
                    <div className="flex gap-2">
                      {canCancel && (
                        <button
                          className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 disabled:opacity-50"
                          onClick={(e) => handleCancelClick(order._id, e)}
                        >
                          <Trash2 size={16} className="mr-1" />
                          Cancel Order
                        </button>
                      )}
                      {canDelete && (
                        <button
                          className="flex items-center px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50"
                          onClick={(e) => handleDeleteClick(order._id, e)}
                        >
                          <Trash2 size={16} className="mr-1" />
                          Delete Order
                        </button>
                      )}
                      <button
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {cancelConfirmId === order._id && (
                  <div className="bg-red-50 p-4 border-t border-red-200 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-red-800">
                        Are you sure you want to cancel this order?
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => handleCancelConfirm(order._id, e)}
                          className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Check size={16} className="mr-1" />
                          Yes
                        </button>
                        <button
                          onClick={(e) => handleCancelClick(order._id, e)}
                          className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <X size={16} className="mr-1" />
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {deleteConfirmId === order._id && (
                  <div className="bg-gray-50 p-4 border-t border-gray-200 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-800">
                        Are you sure you want to delete this order from your history?
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => handleDeleteConfirm(order._id, e)}
                          className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-400 transition-colors"
                        >
                          <Check size={16} className="mr-1" />
                          Yes
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(order._id, e)}
                          className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <X size={16} className="mr-1" />
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {filterStatus === 'All' ? 'No orders found' : `No ${filterStatus.toLowerCase()} orders found`}
          </h3>
          <p className="mt-1 text-sm text-gray-500">Get started by shopping for products.</p>
          <button
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700"
            onClick={() => navigate('/shop/listing')}
          >
            Start Shopping
          </button>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default OrdersTab;
