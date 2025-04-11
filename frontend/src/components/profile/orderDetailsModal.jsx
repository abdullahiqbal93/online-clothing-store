import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const OrderDetailsModal = ({ order, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!order) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300"
    >
      <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-md p-8 relative transform transition-all duration-300">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <h2
          id="modal-title"
          className="text-3xl font-semibold text-gray-800 mb-6 text-center tracking-wide"
        >
          Order Details
        </h2>
        <div className="mb-6 space-y-2 border-b pb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Order ID:</span> {order._id}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Order Date:</span> {new Date(order.orderDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Status:</span>{' '}
            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Items</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {order.cartItems.map((item, index) => (
              <div key={index} className="border-b pb-2">
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                <p className="text-sm text-gray-700">
                  ${ (item.salePrice !== undefined ? item.salePrice : item.price).toFixed(2) }
                </p>
              </div>
            ))}
          </div>
        </div>
        {order.shippingAddress && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Shipping Address</h3>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalcode}
            </p>
            <p className="text-sm text-gray-600">Phone: {order.shippingAddress.phone}</p>
          </div>
        )}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Payment Information</h3>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Method:</span> {order.paymentMethod.toUpperCase()}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Status:</span> {order.paymentStatus.toUpperCase()}
          </p>
          {order.refundAmount > 0 && (
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Refund:</span> ${order.refundAmount.toFixed(2)}
            </p>
          )}
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-800">
            Total Amount: <span className="text-2xl">${order.totalAmount.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
