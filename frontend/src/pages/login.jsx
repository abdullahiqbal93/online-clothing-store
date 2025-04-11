import React, { useState } from 'react';
import CommonForm from '@/components/ui/form';
import { registerFormControls, loginFormControls } from '@/config/index';
import { toast } from "sonner";
import { loginUser, registerUser } from "@/lib/store/features/user/userSlice";
import { useDispatch } from "react-redux";
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';


const registerInitialState = { name: '', email: '', password: '' };
const loginInitialState = { email: "", password: "" };

const AuthPage = () => {
    const [registerData, setRegisterData] = useState(registerInitialState);
    const [loginData, setLoginData] = useState(loginInitialState);
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleRegister = async (event) => {
        event.preventDefault();

        dispatch(registerUser(registerData)).then((data) => {
            if (data?.payload?.success) {
                toast.success("Account created successfully!" || data?.payload?.message);
                setIsRegister(false);
            } else {
                toast.error(data?.payload?.message || "Something went wrong");
            }
        })
    };


    const handleLogin = async (event) => {
        event.preventDefault();

        dispatch(loginUser(loginData)).then((data) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message || "You have successfully logged in");
                navigate('/');
            } else {
                toast.error(data?.payload?.message || "Something went wrong");
            }
        });
    };


    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
            <motion.div
                className="w-full max-w-[420px] bg-white rounded-xl p-8 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >

                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                        Flexxy
                    </h1>
                    <p className="text-xs tracking-widest text-gray-500 uppercase">
                        Modern Essentials
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="flex justify-center border-b border-gray-200 mb-8">
                        <button
                            onClick={() => setIsRegister(!isRegister)}
                            className={`pb-4 px-6 text-sm font-medium ${isRegister
                                ? 'text-gray-500 border-b-2 border-transparent'
                                : 'text-gray-900 border-b-2 border-black'
                                } transition-all duration-300`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsRegister(!isRegister)}
                            className={`pb-4 px-6 text-sm font-medium ${!isRegister
                                ? 'text-gray-500 border-b-2 border-transparent'
                                : 'text-gray-900 border-b-2 border-black'
                                } transition-all duration-300`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {isRegister ? (
                        <CommonForm
                            formControls={registerFormControls}
                            buttonText="Create Account"
                            formData={registerData}
                            setFormData={setRegisterData}
                            onSubmit={handleRegister}

                        />
                    ) : (
                        <CommonForm
                            formControls={loginFormControls}
                            buttonText="Sign In"
                            formData={loginData}
                            setFormData={setLoginData}
                            onSubmit={handleLogin}
                        />
                    )}
                </div>


                <div className="mt-6 text-center text-sm text-gray-600">
                    {!isRegister && (
                        <Link 
                            to="/forgot-password" 
                            className="text-gray-600 hover:text-gray-900 hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>
                
                <div className="mt-6 text-center text-xs text-gray-500 space-x-4">
                    <a href="#" className="hover:text-gray-900">Terms</a>
                    <a href="#" className="hover:text-gray-900">Privacy</a>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
