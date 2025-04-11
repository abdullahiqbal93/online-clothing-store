import { Pencil, X, Check } from "lucide-react";
import { useState } from 'react';

function AddressesTab({ addressList, addressForm, setAddressForm, editMode, handleAddressSubmit, handleEditAddress, handleDeleteAddress, resetAddressForm, loading }) {
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const handleDeleteClick = (addressId) => {
        if (deleteConfirmId === addressId) {
            setDeleteConfirmId(null);
        } else {
            setDeleteConfirmId(addressId);
        }
    };

    const handleDeleteConfirm = (addressId) => {
        handleDeleteAddress(addressId);
        setDeleteConfirmId(null);
    };

    return (
        <div>
            <h2 className="text-xl font-medium mb-6">Shipping Addresses</h2>

            <form onSubmit={handleAddressSubmit} className="mb-8 border-b pb-8">
                <h3 className="text-lg font-medium mb-4">{editMode ? 'Edit Address' : 'Add New Address'}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                        <input
                            type="text"
                            value={addressForm.address}
                            onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="123 Main St, Apt 4B"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                            type="text"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="New York"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                        <input
                            type="number"
                            value={addressForm.postalcode}
                            onChange={(e) => setAddressForm({ ...addressForm, postalcode: e.target.value })}
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="10001"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="tel"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="(123) 456-7890"
                            required
                        />
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        className="bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        disabled={loading}
                    >
                        {editMode ? 'Update Address' : 'Add Address'}
                    </button>

                    {editMode && (
                        <button
                            type="button"
                            onClick={resetAddressForm}
                            className="bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <h3 className="text-lg font-medium mb-4">Saved Addresses</h3>
            {addressList && addressList.length > 0 ? (
                <div className="space-y-4">
                    {addressList.map((address) => (
                        <div key={address._id} className="border rounded-lg p-4">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-medium">{address.address}</p>
                                    <p className="text-gray-600">{address.city}, {address.postalcode}</p>
                                    <p className="text-gray-600">{address.phone}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleEditAddress(address)}
                                        className="group flex items-center justify-center p-2 rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-200"
                                        aria-label="Edit address"
                                    >
                                        <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(address._id)}
                                        className="group flex items-center justify-center p-2 rounded-full text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors duration-200"
                                        aria-label="Delete address"
                                    >
                                        <X className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                    </button>
                                </div>
                            </div>

                            {deleteConfirmId === address._id && (
                                <div className="mt-4 p-3 bg-red-50 rounded-lg transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-red-800">
                                            Are you sure you want to delete this address?
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleDeleteConfirm(address._id)}
                                                className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                <Check className="w-4 h-4 mr-1" />
                                                Yes
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(address._id)}
                                                className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                No
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No addresses saved yet.</p>
            )}
        </div>
    );
}

export default AddressesTab;