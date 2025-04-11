import React from 'react';
import { X, Package, Truck, CheckCircle, Clock, User, Phone, MapPin, CreditCard, AlertCircle } from 'lucide-react';

const OrderDetailModal = ({ order, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={18} />;
      case 'confirmed': return <Package size={18} />;
      case 'shipped': return <Truck size={18} />;
      case 'delivered': return <CheckCircle size={18} />;
      case 'cancelled': return <AlertCircle size={18} />;
      default: return <Clock size={18} />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-20 border-b border-gray-200">
          <div className="flex justify-between items-center p-6">
            <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between bg-gray-50 rounded-lg p-4 mb-6">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-mono font-medium">{order._id}</p>
            </div>
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{new Date(order.orderDate).toLocaleString()}</p>
            </div>
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-bold text-lg">${order.totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <div className={`flex items-center px-3 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                {getStatusIcon(order.orderStatus)}
                <span className="ml-2 font-medium">{order.orderStatus}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Order Progress</h3>
            <div className="relative flex justify-between items-center">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2"></div>
              
              {['Pending', 'Confiremd', 'Shipped', 'Delivered'].map((status, index) => {
                const isActive = ['pending', 'confirmed', 'shipped', 'delivered'].indexOf(order.orderStatus) >= index;
                const isCurrent = order.orderStatus === status;
                
                return (
                  <div key={status} className="relative z-10 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                      ${isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-400'
                      }
                      ${isCurrent ? 'ring-4 ring-blue-100' : ''}
                    `}>
                      {index + 1}
                    </div>
                    <span className={`text-xs ${isActive ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User size={20} className="mr-2" />
                Customer & Shipping Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <User size={18} className="text-gray-400 mr-2" />
                  <p>{order.user?.name || 'Unknown'}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">✉️</span>
                  <p>{order.user?.email || 'Unknown'}</p>
                </div>
                <div className="flex items-start">
                  <MapPin size={18} className="text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">{order.shippingAddress.address}</p>
                    <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.postalcode}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone size={18} className="text-gray-400 mr-2" />
                  <p>{order.shippingAddress.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard size={20} className="mr-2" />
                Payment Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.paymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="font-mono">{order.paymentId}</span>
                  </div>
                )}
                {order.refundAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Refund Amount</span>
                    <span className="font-medium text-gray-900">${order.refundAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Package size={20} className="mr-2" />
              Order Items
            </h3>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.cartItems && order.cartItems.map((item) => (
                    <tr key={item.productId} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">{item.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="px-2 py-1 rounded-full bg-gray-100">{item.quantity}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-gray-900">
                          ${(item.salePrice || item.price).toFixed(2)}
                        </p>
                        {item.salePrice && (
                          <p className="text-sm text-gray-500 line-through">${item.price.toFixed(2)}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right font-medium">
                        ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right font-medium text-gray-500">Total</td>
                    <td className="px-4 py-3 text-right font-bold">${order.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;