import React from 'react';
import { Edit, Trash2, X, Check, Shield, User, CheckCircle, XCircle, Save } from 'lucide-react';

const UserTable = ({ users, editingId, editedData, setEditedData, handleEditClick, handleCancelEdit, handleSaveEdit, deleteConfirmId, handleDeleteClick, handleDeleteConfirm }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                No users found matching the filters
              </td>
            </tr>
          ) : (
            users.filter(user => user.role !== 'admin' && user.role !== 'super-admin').map((user) => (
              <React.Fragment key={user._id}>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === user._id ? (
                      <input
                        type="text"
                        value={editedData.name}
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                        className="w-full px-2 py-1 border rounded-md"
                      />
                    ) : (
                      <div className="flex items-center space-x-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={16} className="text-gray-500" />
                          </div>
                        )}
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === user._id ? (
                      <input
                        type="email"
                        value={editedData.email}
                        onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                        className="w-full px-2 py-1 border rounded-md"
                        disabled
                      />
                    ) : (
                      <div className="text-sm text-gray-900">{user.email}</div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === user._id ? (
                      <select
                        value={editedData.role}
                        onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}
                        className="px-2 py-1 border rounded-md"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {user.role === 'admin' ? (
                          <Shield size={16} className="text-blue-500" />
                        ) : (
                          <User size={16} className="text-gray-500" />
                        )}
                        <div className="text-sm text-gray-900">{user.role}</div>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === user._id ? (
                      <select
                        value={editedData.isActive ? 'active' : 'inactive'}
                        onChange={(e) =>
                          setEditedData({ ...editedData, isActive: e.target.value === 'active' })
                        }
                        className="px-2 py-1 border rounded-md"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <div className="flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full">
                        {user.isActive ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <XCircle size={16} className="text-red-500" />
                        )}
                        <span className={user.isActive ? 'text-green-800' : 'text-red-800'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                    {editingId === user._id ? (
                      <>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50"
                        >
                          <X size={18} />
                        </button>
                        <button
                          onClick={() => handleSaveEdit(user._id)}
                          className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50"
                        >
                          <Save size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user._id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>

                {deleteConfirmId === user._id && (
                  <tr className="bg-red-50 transition-all duration-300">
                    <td colSpan="6" className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-red-800">
                          Are you sure you want to delete "{user.name}"?
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteConfirm(user._id)}
                            className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Check size={16} className="mr-1" />
                            Yes
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user._id)}
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
  );
};

export default UserTable;
