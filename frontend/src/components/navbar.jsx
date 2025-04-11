import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchUserCartItems } from '@/lib/store/features/cart/cartSlice';
import { logoutUser } from '@/lib/store/features/user/userSlice';
import { ArrowLeft, Menu, ShoppingCart, UserRound } from 'lucide-react';
import { Sheet } from '@/components/ui/sheet';
import UserCartWrapper from '@/components/cart-wrapper';
import SearchBar from '@/components/searchBar';

function Navbar() {
    const [visible, setVisible] = useState(false);
    const [openCartSheet, setOpenCartSheet] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector(state => state.user);
    const { cartItems } = useSelector(state => state.cart);


    const handleLogout = () => {
        dispatch(logoutUser());
        toast.success('You have successfully logged out');
        navigate('/login');
    };

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchUserCartItems(user?.id));
        }
    }, [dispatch, user]);

    const handleProfileClick = (e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            toast.error('Please login to access your profile');
            navigate('/login');
        }
    };

    return (
        <div className='flex items-center justify-between py-5 font-medium px-8 z-50'>
            <h1 className='w-36 text-2xl'>Flexxy</h1>

            <ul className='hidden sm:flex gap-5 text-m text-gray-700'>
                <NavLink to='/shop/home' className='flex flex-col items-center gap-1'>
                    <p>Home</p>
                    <hr className='w-2/4 border-none h-[2px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/shop/listing' className='flex flex-col items-center gap-1'>
                    <p>Shop</p>
                    <hr className='w-2/4 border-none h-[2px] bg-gray-700 hidden' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-5'>
                 <SearchBar />

                <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
                    <div className='relative'>
                        <ShoppingCart className='w-5 min-w-5 cursor-pointer' onClick={() => setOpenCartSheet(true)} />
                        <p className='absolute right-[-9px] top-[-10px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
                            {cartItems?.items?.length || 0}
                        </p>
                    </div>

                    <UserCartWrapper setOpenCartSheet={setOpenCartSheet}
                        cartItems={cartItems?.items || []}
                    />
                </Sheet>

                <div className="group relative">
                    <Link to={isAuthenticated ? '/shop/profile' : '#'} onClick={handleProfileClick}>
                        <UserRound className="w-5 cursor-pointer text-black hover:text-gray-800 transition-colors" />
                    </Link>
                    {isAuthenticated && (
                        <div className="absolute hidden group-hover:block dropdown-menu right-0 pt-4 z-20">
                            <div className="flex flex-col gap-3 w-40 py-4 px-6 bg-white text-black rounded-3xl shadow-lg transform transition-all duration-300 ease-in-out group-hover:scale-105">
                                <p
                                    className="cursor-pointer text-sm font-medium hover:text-gray-800 hover:translate-x-1 transition-all duration-200"
                                    onClick={() => navigate('/shop/profile')}
                                >
                                    My Profile
                                </p>
                                <p
                                    className="cursor-pointer text-sm font-medium hover:text-red-500 hover:translate-x-1 transition-all duration-200"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </p>
                            </div>
                        </div>
                    )}
                </div>



                <Menu className='w-5 cursor-pointer sm:hidden' onClick={() => setVisible(true)} />
            </div>


            <div className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={() => setVisible(false)}></div>

                <div className={`absolute top-0 right-0 bottom-0 w-3/4 sm:w-2/5 bg-white shadow-2xl transform transition-transform ${visible ? 'translate-x-0' : 'translate-x-full'} rounded-l-2xl`}>
                    <div className="flex flex-col text-gray-800 p-6">
                        <div className="flex items-center gap-4 p-3 cursor-pointer text-gray-600 hover:text-gray-900" onClick={() => setVisible(false)}>
                            <ArrowLeft strokeWidth={1.5} className="h-6" />
                            <p className="text-lg font-medium">Back</p>
                        </div>

                        <NavLink to='/shop/home' className='py-3 text-lg font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all' onClick={() => setVisible(false)}>
                            Home
                        </NavLink>
                        <NavLink to='/shop/listing' className='py-3 text-lg font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all' onClick={() => setVisible(false)}>
                            Shop
                        </NavLink>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Navbar;
