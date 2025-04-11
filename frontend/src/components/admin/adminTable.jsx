import React from "react";
import { Trash2, Edit, Save, X, Check } from "lucide-react";

const AdminTable = ({ userList, isLoading, editingAdmin, setEditingAdmin, saveEditing, cancelEditing, handleDeleteClick, deleteConfirmId, handleDeleteConfirm, startEditing }) => (
  <div className="overflow-x-auto">
    {isLoading ? (
      <p className="text-center py-4">Loading...</p>
    ) : userList.length === 0 ? (
      <p className="text-center py-4">No admin accounts found</p>
    ) : (
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Last Updated</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList
            .filter((user) => user.role === "admin" || user.role === "super-admin")
            .map((admin) => (
              <React.Fragment key={admin._id}>
                <tr className="border-b hover:bg-gray-50">
                  {editingAdmin && editingAdmin.id === admin._id ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editingAdmin.name}
                          onChange={(e) =>
                            setEditingAdmin({ ...editingAdmin, name: e.target.value })
                          }
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="email"
                          value={editingAdmin.email}
                          onChange={(e) =>
                            setEditingAdmin({ ...editingAdmin, email: e.target.value })
                          }
                          className="w-full px-2 py-1 border rounded"
                          disabled
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={editingAdmin.role}
                          onChange={(e) =>
                            setEditingAdmin({ ...editingAdmin, role: e.target.value })
                          }
                          className="w-full px-2 py-1 border rounded"
                        >
                          <option value="super-admin">Super Admin</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">{new Date(admin.updatedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={saveEditing}
                          className="text-green-600 hover:text-green-800 mx-1"
                          title="Save"
                          disabled={isLoading}
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-600 hover:text-gray-800 mx-1"
                          title="Cancel"
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">{admin.name}</td>
                      <td className="px-4 py-2">{admin.email}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${admin.role === "super-admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-4 py-2">{new Date(admin.updatedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-right whitespace-nowrap">
                        <button
                          onClick={() => startEditing(admin)}
                          className="text-blue-600 hover:text-blue-800 mx-1"
                          title="Edit"
                          disabled={isLoading}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(admin._id)}
                          className="text-red-600 hover:text-red-800 mx-1"
                          title="Delete"
                          disabled={admin.role === "super-admin" || isLoading}
                          style={
                            admin.role === "super-admin" ? { opacity: 0.5, cursor: "not-allowed" } : {}
                          }
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
                {deleteConfirmId === admin._id && (
                  <tr className="bg-red-50 transition-all duration-300">
                    <td colSpan="5" className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-red-800">
                          Are you sure you want to delete admin "{admin.name}"?
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteConfirm(admin._id)}
                            className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            disabled={isLoading}
                          >
                            <Check size={16} className="mr-1" />
                            Yes
                          </button>
                          <button
                            onClick={() => handleDeleteClick(admin._id)}
                            className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            disabled={isLoading}
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
    )}
  </div>
);

export default AdminTable;