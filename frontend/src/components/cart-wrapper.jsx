import React from 'react';
import { SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import UserCartItemsContent from '@/components/cart-items-content';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
    const navigate = useNavigate();
    
    const subtotalAmount =
        cartItems && cartItems.length > 0
            ? cartItems.reduce(
                (sum, currentItem) =>
                    sum + (currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) * currentItem?.quantity, 0)
            : 0;

    const totalOriginalPrice = cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
    const savedAmount = totalOriginalPrice - subtotalAmount;

    return (
        <SheetContent className="sm:max-w-md p-0 flex flex-col h-full w-11/12">
            <div className="px-6 py-6 border-b border-gray-100">
                <SheetHeader>
                    <SheetTitle className="text-xl">Your Shopping Bag</SheetTitle>
                    <SheetDescription>
                        {cartItems?.length || 0} {cartItems?.length === 1 ? 'item' : 'items'} in your bag
                    </SheetDescription>
                </SheetHeader>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6">
                {cartItems && cartItems.length > 0 ? (
                    <div className="py-4 space-y-1">
                        {cartItems.map((item) => (
                            <UserCartItemsContent 
                                key={`${item._id}-${item.size}-${item.color}`} 
                                cartItem={item} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">Your bag is empty</h3>
                        <p className="text-sm text-gray-500 mb-6">Start shopping to add items to your bag</p>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                navigate('/shop/listing');
                                setOpenCartSheet(false);
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </div>
                )}
            </div>
            
            {cartItems && cartItems.length > 0 && (
                <div className="border-t border-gray-100 p-6">
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium">${subtotalAmount.toLocaleString('en-US', {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2
                            })}</span>
                        </div>
                        {savedAmount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">You Saved</span>
                                <span className="font-medium text-green-600">${savedAmount.toLocaleString('en-US', {
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 2
                                })}</span>
                            </div>
                        )}
                    </div>
                    
                    <SheetFooter className="flex-col gap-3">
                        <Button 
                            className="w-full"
                            onClick={() => {
                                navigate('/shop/checkout');
                                setOpenCartSheet(false);
                            }}
                        >
                            Proceed to Checkout
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                                navigate('/shop/listing');
                                setOpenCartSheet(false);
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </SheetFooter>
                </div>
            )}
        </SheetContent>
    );
}

export default UserCartWrapper;
