import React from "react";
import { X } from "lucide-react";

const AdminForm = ({ adminData, setAdminData, onSubmit, onCancel, isLoading, isEdit = false }) => (
  <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-medium">{isEdit ? "Edit Admin" : "Create New Admin"}</h3>
      {!isEdit && (
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      )}
    </div>
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 mb-1 text-sm">Name</label>
        <input
          type="text"
          value={adminData.name}
          onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1 text-sm">Email</label>
        <input
          type="email"
          value={adminData.email}
          onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={isEdit}
        />
      </div>
      {!isEdit && (
        <div>
          <label className="block text-gray-700 mb-1 text-sm">Password</label>
          <input
            type="password"
            value={adminData.password}
            onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={6}
          />
        </div>
      )}
      <div>
        <label className="block text-gray-700 mb-1 text-sm">Role</label>
        <select
          value={adminData.role}
          onChange={(e) => setAdminData({ ...adminData, role: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="super-admin">Super Admin</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <button
          type="submit"
          className={`px-4 py-2 ${
            isEdit ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
          } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-${
            isEdit ? "blue" : "green"
          }-500`}
          disabled={isLoading}
        >
          {isEdit ? "Save Changes" : "Create Admin"}
        </button>
      </div>
    </form>
  </div>
);

export default AdminForm;