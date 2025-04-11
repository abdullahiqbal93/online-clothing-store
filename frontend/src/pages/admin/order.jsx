import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import OrderFilters from '@/components/admin/orderFilter';
import OrderTable from '@/components/admin/orderTable';
import { getAllOrdersForAdmin, updateOrderStatus, deleteOrder, deleteOrderForAdmin } from '@/lib/store/features/order/adminOrderSlice';
import { Skeleton } from '@/components/ui/skeleton';
import Pagination from '@/components/shop/pagination';

const AdminOrderListPage = () => {
  const dispatch = useDispatch();
  const { orderList, isLoading } = useSelector((state) => state.adminOrder);
  const { user } = useSelector((state) => state.user); 
  const isSuperAdmin = user?.role === 'super-admin'; 
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleted, setShowDeleted] = useState(false); 
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const handleDeleteOrder = async (id) => {
    try {
      await dispatch(deleteOrder(id)).unwrap();
      toast.success('Order permanently deleted');
      dispatch(getAllOrdersForAdmin());
    } catch (error) {
      toast.error(error.message || 'Error deleting order');
    }
  };

  const handleSoftDeleteOrder = async (id) => {
    try {
      await dispatch(deleteOrderForAdmin(id)).unwrap();
      toast.success('Order deleted successfully');
      dispatch(getAllOrdersForAdmin());
    } catch (error) {
      toast.error(error.message || 'Error hiding order');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id, orderStatus: newStatus })).unwrap();
      toast.success('Order status updated successfully');
      dispatch(getAllOrdersForAdmin());
    } catch (error) {
      toast.error(error.message || 'Error updating status');
    }
  };

  const filteredOrders = orderList.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    const matchesDeleted = showDeleted || !order.deletedFor?.admin;
    if (!searchQuery) return matchesStatus && matchesDeleted;

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      order._id.toLowerCase().includes(searchLower) ||
      (order.userId && order.userId.toLowerCase().includes(searchLower)) ||
      (order.user?.name && order.user.name.toLowerCase().includes(searchLower));

    return matchesStatus && matchesSearch && matchesDeleted;
  });

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="max-w-8xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Order List</h1>
          {isSuperAdmin && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={() => setShowDeleted(!showDeleted)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Show Deleted Orders</span>
            </label>
          )}
        </div>

        <OrderFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {isLoading ? (
          <Skeleton count={5} />
        ) : (
          <>
            <OrderTable
              orders={currentOrders}
              handleUpdateStatus={handleUpdateStatus}
              handleDeleteOrder={handleDeleteOrder}
              handleSoftDeleteOrder={handleSoftDeleteOrder}
              isSuperAdmin={isSuperAdmin}
            />

            {filteredOrders.length > 0 && (
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
};

export default AdminOrderListPage;