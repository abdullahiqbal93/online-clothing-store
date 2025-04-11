import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import UserFilters from '@/components/admin/userFilter';
import UserTable from '@/components/admin/userTable';
import { fetchAllUsers, deleteUser, editUser } from '@/lib/store/features/user/adminUserSlice';
import { Skeleton } from '@/components/ui/skeleton';
import Pagination from '@/components/shop/pagination';

const AdminUserListPage = () => {
  const dispatch = useDispatch();
  const { userList, isLoading } = useSelector((state) => state.adminUser);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleEditClick = (user) => {
    setEditingId(user._id);
    setEditedData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedData({});
  };

  const filteredUsers = useMemo(() => {
    return userList.filter((user) => {
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' ? user.isActive : !user.isActive);

      if (!searchQuery) return matchesRole && matchesStatus;

      const searchLower = searchQuery.toLowerCase();
      return matchesRole && 
        matchesStatus && 
        ((user.name?.toLowerCase().includes(searchLower)) ||
         (user.email?.toLowerCase().includes(searchLower)) ||
         (user._id?.toLowerCase().includes(searchLower)));
    });
  }, [userList, roleFilter, statusFilter, searchQuery]);

  const handleSaveEdit = useCallback(async (id) => {
    try {
      await dispatch(editUser({ id, formData: editedData })).unwrap();
      toast.success('User updated successfully');
      setEditingId(null);
      dispatch(fetchAllUsers());
    } catch (error) {
      toast.error(error.message || 'Error updating user');
    }
  }, [dispatch, editedData]);

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id === deleteConfirmId ? null : id);
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success('User deleted successfully');
      dispatch(fetchAllUsers());
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error(error.message || 'Error deleting user');
      setDeleteConfirmId(null);
    }
  };

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="max-w-8xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User List</h1>
        </div>

        <UserFilters
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {isLoading ? (
          <Skeleton count={5} />
        ) : (
          <>
            <UserTable
              users={currentUsers}
              editingId={editingId}
              editedData={editedData}
              setEditedData={setEditedData}
              handleEditClick={handleEditClick}
              handleCancelEdit={handleCancelEdit}
              handleSaveEdit={handleSaveEdit}
              deleteConfirmId={deleteConfirmId}
              handleDeleteClick={handleDeleteClick}
              handleDeleteConfirm={handleDeleteConfirm}
            />

            {filteredUsers.length > 0 && (
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

export default AdminUserListPage;