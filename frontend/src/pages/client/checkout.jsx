import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewAddress, fetchAllUserAddresses } from '@/lib/store/features/address/addressSlice';
import { fetchUserCartItems } from '@/lib/store/features/cart/cartSlice';
import { createNewOrder } from '@/lib/store/features/order/orderSlice';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import CheckoutItem from '@/components/checkout/checkout-item';
import { FaCreditCard, FaPaypal } from 'react-icons/fa';
import { toast } from 'sonner';

function CheckoutPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { addressList } = useSelector((state) => state.address);
  const { approvalURL, isLoading } = useSelector((state) => state.order);
  const cart = useSelector((state) => state.cart.cartItems);

  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchAllUserAddresses(user?.id));
      dispatch(fetchUserCartItems(user?.id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);

  const steps = [
    { number: 1, title: 'Shipping Address' },
    { number: 2, title: 'Payment Method' },
    { number: 3, title: 'Review Order' },
  ];

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (total, item) => total + (item.salePrice || item.price) * item.quantity,
      0
    );
  };

  const selectedAddressData = useMemo(() => {
    if (!selectedAddress) return null;
    return addressList.find((addr) => addr._id === selectedAddress);
  }, [selectedAddress, addressList]);

  const validateNewAddress = () => {
    const errors = {};
    if (!newAddress.address.trim()) errors.address = 'Address is required';
    if (!newAddress.city.trim()) errors.city = 'City is required';
    if (!newAddress.postalCode.trim()) errors.postalCode = 'Postal code is required';
    if (!newAddress.phone.trim()) errors.phone = 'Phone number is required';
    return errors;
  };

  const handleStepChange = (step) => {
    if (step < 1 || step > 3) return;
    if (step === 2) {
      if (!selectedAddress && !isNewAddressFilled()) {
        const errors = validateNewAddress();
        if (Object.keys(errors).length > 0) {
          toast.error('Please complete all address fields or Select an address');
          return;
        }
      }
    }
    setActiveStep(step);
  };

  const isNewAddressFilled = () => {
    return Object.values(newAddress).every((value) => value.trim() !== '');
  };

  const handleInitiatePaypalPayment = async () => {
    if (!cart?.items?.length) {
      toast.error('Your cart is empty. Please add items to proceed.');
      return;
    }

    if (!selectedAddress && !isNewAddressFilled()) {
      toast.error('Please select or add a shipping address.');
      return;
    }

    let addressId = selectedAddress;
    let addressData = selectedAddress
      ? addressList.find((addr) => addr._id === selectedAddress)
      : newAddress;

    if (!selectedAddress && isNewAddressFilled()) {
      const newAddressData = {
        userId: user?.id,
        address: newAddress.address,
        city: newAddress.city,
        postalcode: newAddress.postalCode,
        phone: newAddress.phone,
      };
      const result = await dispatch(addNewAddress(newAddressData)).unwrap();
      if (result.success) {
        addressId = result.data._id;
        addressData = result.data;
      } else {
        toast.error('Failed to save new address.');
        return;
      }
    }

    const orderData = {
      userId: user?.id,
      cartId: cart?._id,
      cartItems: cart.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.images[0],
        price: item.salePrice || item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      })),
      shippingAddress: {
        addressId: addressId,
        address: addressData.address,
        city: addressData.city,
        postalcode: addressData.postalCode || addressData.postalcode,
        phone: addressData.phone,
      },
      orderStatus: 'pending',
      paymentMethod: paymentMethod,
      paymentStatus: 'pending',
      totalAmount: calculateTotal(),
      paymentId: '',
      payerId: '',
    };

    dispatch(createNewOrder(orderData)).then((result) => {
      if (result.payload?.success) {
        toast.success('Redirecting to PayPal...');
      } else {
        toast.error('Failed to initiate payment: ' + (result.payload?.message || 'Unknown error'));
      }
    });
  };

  const handleConfirmOrder = async () => {
    if (paymentMethod === 'paypal') {
      await handleInitiatePaypalPayment();
    } else {
      toast.info('Only PayPal is currently supported.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Checkout Steps</h2>
                <div className="space-y-4">
                  {steps.map((step) => (
                    <div
                      key={step.number}
                      onClick={() => handleStepChange(step.number)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${activeStep === step.number
                        ? 'bg-gray-800 text-white shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === step.number ? 'bg-white text-gray-900' : 'bg-gray-300'
                            }`}
                        >
                          <span className="font-bold">{step.number}</span>
                        </div>
                        <span className="font-medium">{step.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Order Summary</h3>
                <div className="space-y-4">
                  {cart?.items?.map((item) => (
                  <CheckoutItem
                    key={item._id}
                    item={item}
                  />
                ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between mb-2 text-gray-600">
                    <span>Subtotal:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-gray-600">
                    <span>Shipping:</span>
                    <span className="text-gray-800">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-8">
              {activeStep === 1 && (
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addressList.map((address) => (
                      <div
                        key={address._id}
                        onClick={() => {
                          setSelectedAddress(selectedAddress === address._id ? null : address._id);
                        }}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress === address._id
                          ? 'border-gray-800 bg-gray-100'
                          : 'border-gray-200 hover:border-gray-400'
                          }`}
                      >
                        <p className="text-gray-600">{address.address}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.postalcode}
                        </p>
                        <p className="text-gray-600 mt-2">{address.phone}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-bold mb-6 text-gray-800">New Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          Street Address
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                          value={newAddress.address}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, address: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, city: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                          value={newAddress.postalCode}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, postalCode: e.target.value })
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                          value={newAddress.phone}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Method</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'paypal'
                        ? 'border-gray-800 bg-gray-100'
                        : 'border-gray-200 hover:border-gray-400'
                        }`}
                      onClick={() => setPaymentMethod('paypal')}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                          <FaPaypal className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">PayPal</h3>
                          <p className="text-sm text-gray-600">
                            Safe and fast online payments
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card'
                        ? 'border-gray-800 bg-gray-100'
                        : 'border-gray-200 hover:border-gray-400'
                        }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                          <FaCreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Credit/Debit Card</h3>
                          <p className="text-sm text-gray-600">
                            Secure payment with your card
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Review Your Order</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        Shipping Details
                      </h3>
                      {selectedAddress ? (
                        addressList.find((addr) => addr._id === selectedAddress) ? (
                          <div>
                            <p className="text-gray-600">
                              {addressList.find((addr) => addr._id === selectedAddress).address}
                            </p>
                            <p className="text-gray-600">
                              {addressList.find((addr) => addr._id === selectedAddress).city},{' '}
                              {
                                addressList.find((addr) => addr._id === selectedAddress)
                                  .postalcode
                              }
                            </p>
                            <p className="text-gray-600">
                              {addressList.find((addr) => addr._id === selectedAddress).phone}
                            </p>
                          </div>
                        ) : null
                      ) : isNewAddressFilled() ? (
                        <div className="text-gray-600">
                          <p>{newAddress.address}</p>
                          <p>
                            {newAddress.city}, {newAddress.postalCode}
                          </p>
                          <p>{newAddress.phone}</p>
                        </div>
                      ) : (
                        <p className="text-gray-600">No address selected</p>
                      )}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        Payment Method
                      </h3>
                      <p className="text-gray-600 capitalize">{paymentMethod}</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Items</h3>
                      <div className="space-y-4">
                        {cart?.items?.map((item) => (
                          <CheckoutItem key={item._id} item={item} variant="detailed" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <button
                  onClick={() => handleStepChange(activeStep - 1)}
                  disabled={activeStep === 1}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeStep === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-800 text-white hover:bg-black'
                    }`}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    activeStep < 3 ? handleStepChange(activeStep + 1) : handleConfirmOrder()
                  }
                  disabled={isLoading}
                  className={`px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-black transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {isLoading
                    ? 'Processing...'
                    : activeStep === 3
                      ? 'Confirm Order'
                      : 'Next Step'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CheckoutPage;