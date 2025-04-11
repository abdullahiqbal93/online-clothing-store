import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, Key, Plus, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { fetchAllUsers, registerUser, editUser, deleteUser, changeUserPassword } from "@/lib/store/features/user/adminUserSlice";
import AdminForm from "@/components/admin/adminForm";
import AdminTable from "@/components/admin/adminTable";

const AdminSettings = () => {
  const dispatch = useDispatch();
  const { userList, isLoading } = useSelector((state) => state.adminUser);
  const { user: currentUser } = useSelector((state) => state.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showNewAdminForm, setShowNewAdminForm] = useState(false);
  const [activeTab, setActiveTab] = useState("password");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const isSuperAdmin = currentUser?.role === "super-admin";

  useEffect(() => {
    if (isSuperAdmin) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, isSuperAdmin]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      await dispatch(changeUserPassword({ currentPassword, newPassword })).unwrap();
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      toast.error("Only Super Admins can create new admins");
      return;
    }
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error("All fields are required");
      return;
    }
    if (newAdmin.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      const response = await dispatch(registerUser({ ...newAdmin })).unwrap();
      if (response.success === false) {
        throw new Error(response.message);
      }
      setNewAdmin({ name: "", email: "", password: "", role: "admin" });
      setShowNewAdminForm(false);
      toast.success("Admin created successfully");
      dispatch(fetchAllUsers());
    } catch (error) {
      toast.error(error.message || "Failed to create admin");
    }
  };

  const startEditing = (admin) => {
    if (!isSuperAdmin) {
      toast.error("Only Super Admins can edit admin accounts");
      return;
    }
    setEditingAdmin({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  };

  const saveEditing = async () => {
    if (!isSuperAdmin) {
      toast.error("Only Super Admins can edit admin accounts");
      return;
    }
    if (!editingAdmin.name || !editingAdmin.email) {
      toast.error("Name and email are required");
      return;
    }
    try {
      await dispatch(
        editUser({
          id: editingAdmin.id,
          formData: {
            name: editingAdmin.name,
            email: editingAdmin.email,
            role: editingAdmin.role,
          },
        })
      ).unwrap();
      setEditingAdmin(null);
      toast.success("Admin updated successfully");
      dispatch(fetchAllUsers());
    } catch (error) {
      toast.error(error.message || "Failed to update admin");
    }
  };

  const cancelEditing = () => {
    setEditingAdmin(null);
  };

  const handleDeleteClick = (adminId) => {
    if (!isSuperAdmin) {
      toast.error("Only Super Admins can delete admin accounts");
      return;
    }
    setDeleteConfirmId(adminId === deleteConfirmId ? null : adminId);
  };

  const handleDeleteConfirm = async (adminId) => {
    if (!isSuperAdmin) {
      toast.error("Only Super Admins can delete admin accounts");
      return;
    }
    try {
      await dispatch(deleteUser(adminId)).unwrap();
      toast.success("Admin deleted successfully");
      dispatch(fetchAllUsers());
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete admin");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "password"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("password")}
        >
          <div className="flex items-center gap-2">
            <Key size={18} />
            <span>Change Password</span>
          </div>
        </button>
        {isSuperAdmin && (
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "accounts"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("accounts")}
          >
            <div className="flex items-center gap-2">
              <User size={18} />
              <span>Admin Accounts</span>
            </div>
          </button>
        )}
      </div>

      {activeTab === "password" && (
        <div className="max-w-md ml-4">
          <h2 className="text-xl font-semibold mb-4">Change Your Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword.current ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500"
                  onClick={() =>
                    setShowPassword({ ...showPassword, current: !showPassword.current })
                  }
                  disabled={isLoading}
                >
                  {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500"
                  onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                  disabled={isLoading}
                >
                  {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500"
                  onClick={() =>
                    setShowPassword({ ...showPassword, confirm: !showPassword.confirm })
                  }
                  disabled={isLoading}
                >
                  {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "accounts" && isSuperAdmin && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Manage Admin Accounts</h2>
            {!showNewAdminForm && (
              <button
                onClick={() => setShowNewAdminForm(true)}
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-1"
                disabled={isLoading}
              >
                <Plus size={16} /> <span>New Admin</span>
              </button>
            )}
          </div>

          {showNewAdminForm && (
            <AdminForm
              adminData={newAdmin}
              setAdminData={setNewAdmin}
              onSubmit={handleCreateAdmin}
              onCancel={() => setShowNewAdminForm(false)}
              isLoading={isLoading}
            />
          )}

          <AdminTable
            userList={userList}
            isLoading={isLoading}
            editingAdmin={editingAdmin}
            setEditingAdmin={setEditingAdmin}
            saveEditing={saveEditing}
            cancelEditing={cancelEditing}
            handleDeleteClick={handleDeleteClick}
            deleteConfirmId={deleteConfirmId}
            handleDeleteConfirm={handleDeleteConfirm}
            startEditing={startEditing}
          />
        </div>
      )}
      {activeTab === "accounts" && !isSuperAdmin && (
        <div className="text-center py-4 text-gray-500">
          Only Super Admins can manage admin accounts
        </div>
      )}
    </div>
  );
};

export default AdminSettings;