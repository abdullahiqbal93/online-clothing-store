import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from '@/components/navbar';
import { fetchAllUserAddresses, addNewAddress, deleteAddress, editAddress } from '@/lib/store/features/address/addressSlice';
import { getAllOrdersByUserId } from '@/lib/store/features/order/orderSlice';
import { changeUserPassword, fetchUserById, editUser } from '@/lib/store/features/user/adminUserSlice';
import { fetchWishlist, removeFromWishlist } from '@/lib/store/features/wishlist/wishlistSlice';
import ProfileSidebar from '@/components/profile/profileSideBar';
import ProfileInfo from '@/components/profile/profileInfoTab';
import OrdersTab from '@/components/profile/orderTab';
import AddressesTab from '@/components/profile/addressTab';
import WishlistTab from '@/components/profile/wishlistTab';
import SecurityTab from '@/components/profile/securityTab';

function ProfilePage() {
  const dispatch = useDispatch();
  const { user, loading: userLoading, error: userError } = useSelector((state) => state.user);
  const { addressList, isLoading: addressLoading, error: addressError } = useSelector((state) => state.address);
  const { orderList, isLoading: orderLoading, error: orderError } = useSelector((state) => state.order);
  const { items: wishlist, isLoading: wishlistLoading, error: wishlistError } = useSelector((state) => state.wishlist);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [addressForm, setAddressForm] = useState({
    address: '',
    city: '',
    postalcode: '',
    phone: '',
  });
  const [editMode, setEditMode] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });


  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const fetchedUser = await dispatch(fetchUserById(user.id)).unwrap();
        setProfileForm({
          name: fetchedUser.data.name || '',
          email: fetchedUser.data.email || '',
          phoneNumber: fetchedUser.data.phoneNumber || '',
        });
        await Promise.all([
          dispatch(fetchAllUserAddresses(user.id)),
          dispatch(getAllOrdersByUserId(user.id)),
          dispatch(fetchWishlist(user.id)),
        ]);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch user data');
      }
    };

    fetchData();
  }, [dispatch, user?.id]);


  useEffect(() => {
    const errors = { orderError, addressError, userError, wishlistError };
    Object.entries(errors).forEach(([key, error]) => {
      if (error) toast.error(error);
    });
  }, [orderError, addressError, userError, wishlistError]);


  const handlePasswordChange = useCallback(async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      await dispatch(changeUserPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })).unwrap();
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    }
  }, [dispatch, passwordForm]);

  const handleProfileUpdate = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = { name: profileForm.name, phoneNumber: profileForm.phoneNumber };
      await dispatch(editUser({ id: user.id, formData })).unwrap();
      const updatedUser = await dispatch(fetchUserById(user.id)).unwrap();
      setProfileForm({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phoneNumber: updatedUser.phoneNumber || '',
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  }, [dispatch, user?.id, profileForm]);

  const handleAddressSubmit = useCallback(async (e) => {
    e.preventDefault();
    const formData = { ...addressForm, userId: user.id };
    try {
      if (editMode) {
        await dispatch(editAddress({ userId: user.id, addressId: editMode, formData })).unwrap();
        toast.success('Address updated successfully');
      } else {
        await dispatch(addNewAddress(formData)).unwrap();
        toast.success('Address added successfully');
      }
      resetAddressForm();
      await dispatch(fetchAllUserAddresses(user.id));
    } catch (error) {
      toast.error(error.message || `Failed to ${editMode ? 'update' : 'add'} address`);
    }
  }, [dispatch, user?.id, addressForm, editMode]);

  const handleDeleteAddress = useCallback((addressId) => {
    dispatch(deleteAddress({ userId: user.id, addressId }))
      .unwrap()
      .then(() => {
        toast.success('Address deleted successfully');
        dispatch(fetchAllUserAddresses(user.id));
      })
      .catch((error) => toast.error(error.message || 'Failed to delete address'));
  }, [dispatch, user?.id]);

  const handleEditAddress = useCallback((address) => {
    setAddressForm({ address: address.address, city: address.city, postalcode: address.postalcode, phone: address.phone });
    setEditMode(address._id);
  }, []);

  const resetAddressForm = useCallback(() => {
    setAddressForm({ address: '', city: '', postalcode: '', phone: '' });
    setEditMode(null);
  }, []);

  const handleRemoveFromWishlist = useCallback((productId) => {
    dispatch(removeFromWishlist({ userId: user.id, productId }))
      .unwrap()
      .then(() => toast.success('Item removed from wishlist'))
      .catch((error) => toast.error(error || 'Failed to remove item from wishlist'));
  }, [dispatch, user?.id]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
          <div className="md:w-3/4">
            <div className="bg-white shadow rounded-lg p-6">
              {activeTab === 'profile' && (
                <ProfileInfo
                  profileForm={profileForm}
                  setProfileForm={setProfileForm}
                  handleProfileUpdate={handleProfileUpdate}
                  loading={loading}
                />
              )}
              {activeTab === 'orders' && <OrdersTab orderList={orderList} loading={orderLoading} />}
              {activeTab === 'addresses' && (
                <AddressesTab
                  addressList={addressList}
                  addressForm={addressForm}
                  setAddressForm={setAddressForm}
                  editMode={editMode}
                  handleAddressSubmit={handleAddressSubmit}
                  handleEditAddress={handleEditAddress}
                  handleDeleteAddress={handleDeleteAddress}
                  resetAddressForm={resetAddressForm}
                  loading={addressLoading}
                />
              )}
              {activeTab === 'wishlist' && (
                <WishlistTab
                  wishlist={wishlist}
                  handleRemoveFromWishlist={handleRemoveFromWishlist}
                  loading={wishlistLoading}
                />
              )}
              {activeTab === 'security' && (
                <SecurityTab
                  passwordForm={passwordForm}
                  setPasswordForm={setPasswordForm}
                  handlePasswordChange={handlePasswordChange}
                  loading={userLoading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
