import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '@/lib/store/features/user/adminUserSlice';
import { getAllOrdersForAdmin } from '@/lib/store/features/order/adminOrderSlice';
import { fetchAllProducts } from '@/lib/store/features/product/productSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState('30');

  const { userList = [] } = useSelector((state) => state.adminUser || {});
  const { orderList = [] } = useSelector((state) => state.adminOrder || {});
  const { productList = [] } = useSelector((state) => state.product || {});

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllProducts());
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const getFilteredOrders = () => {
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - parseInt(dateRange));
    return orderList.filter((order) => {
      const orderDate = new Date(order.orderDate || order.createdAt || Date.now());
      return orderDate >= pastDate;
    });
  };

  const filteredOrders = getFilteredOrders();

  const totalSales = filteredOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  const recentOrders = [...orderList]
    .sort((a, b) => new Date(b.orderDate || b.createdAt || 0) - new Date(a.orderDate || a.createdAt || 0))
    .slice(0, 5);
  const activeUsers = userList.filter((user) => user.role !== 'admin' && user.role !== 'super-admin' && user?.isActive).length;
  const lowStockProducts = productList.filter((product) => (product?.totalStock || 0) < 10).length;
  const pendingOrders = filteredOrders.filter((order) => order.orderStatus === 'pending' || !order.orderStatus).length;

  return (
    <div className="max-w-8xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>
  
      <div className="mb-6">
        <div className="inline-flex rounded-md shadow-sm bg-white">
          <button
            type="button"
            onClick={() => setDateRange('7')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${dateRange === '7' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-200`}
          >
            7 Days
          </button>
          <button
            type="button"
            onClick={() => setDateRange('30')}
            className={`px-4 py-2 text-sm font-medium ${dateRange === '30' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border-t border-b border-gray-200`}
          >
            30 Days
          </button>
          <button
            type="button"
            onClick={() => setDateRange('90')}
            className={`px-4 py-2 text-sm font-medium ${dateRange === '90' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border-t border-b border-gray-200`}
          >
            90 Days
          </button>
          <button
            type="button"
            onClick={() => setDateRange('365')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${dateRange === '365' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-200`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Revenue</p>
              <h3 className="text-2xl font-bold">${totalSales.toFixed(2)}</h3>
              <p className="text-xs text-gray-500">Last {dateRange} days</p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-full">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Orders</p>
              <h3 className="text-2xl font-bold">{filteredOrders.length}</h3>
              <p className="text-xs text-gray-500">Last {dateRange} days</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Products</p>
              <h3 className="text-2xl font-bold">{productList.length}</h3>
              <p className="text-xs text-gray-500">Total in Catalog</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V7a2 2 0 00-2-2h-2V3a1 1 0 00-1-1h-4a1 1 0 00-1 1v2H6a2 2 0 00-2 2v6a2 2 0 002 2h2v3a1 1 0 001 1h4a1 1 0 001-1v-3h2a2 2 0 002-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Users</p>
              <h3 className="text-2xl font-bold">{activeUsers}</h3>
              <p className="text-xs text-gray-500">Total Customers</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Inventory Status</h2>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-32 h-32 transform -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={lowStockProducts > 0 ? '#EF4444' : '#10B981'}
                  strokeWidth="3"
                  strokeDasharray={`${(lowStockProducts / productList.length) * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{lowStockProducts}</span>
                <span className="text-xs text-gray-500">Low Stock</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 max-h-24 overflow-y-auto overscroll-contain">
            {productList
              .filter((p) => (p?.totalStock || 0) < 10)
              .map((product, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="text-sm font-medium">{product.name}</span>
                  <span className="text-sm text-red-600 font-medium">{product.totalStock || 0} left</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Order Activity</h2>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded mb-3">
            <div>
              <p className="text-sm font-medium">Total Orders</p>
              <p className="text-xl font-bold">{filteredOrders.length}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Pending Orders</p>
              <p className="text-xl font-bold text-yellow-600">{pendingOrders}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm">
                Pending: {filteredOrders.filter((o) => o.orderStatus === 'pending' || !o.orderStatus).length} (
                {((filteredOrders.filter((o) => o.orderStatus === 'pending' || !o.orderStatus).length / filteredOrders.length) * 100 || 0).toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">
                Confirmed: {filteredOrders.filter((o) => o.orderStatus === 'confirmed').length} (
                {((filteredOrders.filter((o) => o.orderStatus === 'confirmed').length / filteredOrders.length) * 100 || 0).toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
              <span className="text-sm">
                Shipped: {filteredOrders.filter((o) => o.orderStatus === 'shipped').length} (
                {((filteredOrders.filter((o) => o.orderStatus === 'shipped').length / filteredOrders.length) * 100 || 0).toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">
                Delivered: {filteredOrders.filter((o) => o.orderStatus === 'delivered').length} (
                {((filteredOrders.filter((o) => o.orderStatus === 'delivered').length / filteredOrders.length) * 100 || 0).toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm">
                Cancelled: {filteredOrders.filter((o) => o.orderStatus === 'cancelled').length} (
                {((filteredOrders.filter((o) => o.orderStatus === 'cancelled').length / filteredOrders.length) * 100 || 0).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mt-4">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order._id || order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{order._id || order.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{order.user ? order.user.name : order.userId || 'Unknown'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(order.orderDate || order.createdAt || Date.now()).toLocaleDateString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">${(order.totalAmount || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${order.orderStatus === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.orderStatus === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : order.orderStatus === 'shipped'
                              ? 'bg-indigo-100 text-indigo-800'
                              : order.orderStatus === 'confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {order.orderStatus || 'pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-sm text-gray-500 text-center">No recent orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;