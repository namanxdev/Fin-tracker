import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "../store/authStore"; 
import toast, { Toaster } from 'react-hot-toast';
import { Mail, KeyRound, Eye, EyeOff } from 'lucide-react';

// Enhanced schema with better error messages
const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters")
});

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    
    const login = useAuthStore((state) => state.login);
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        reset
    } = useForm({
        defaultValues: {
        email: "",
        password: ""
        },
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            toast.success('Successfully LoggedIn!');
            reset(); 
        } catch (error) {
            // Error handling remains the same
            if (error.response) {
                const { status, data } = error.response;
                
                if (status === 401) {
                    setError("password", {
                        message: "Invalid email or password"
                    });
                } else if (status === 404) {
                    setError("email", {
                        message: "Email not registered"
                    });
                } else if (data?.message) {
                    setError("root", {
                        message: data.message
                    });
                } else {
                    setError("root", {
                        message: "An unexpected error occurred"
                    });
                }
            } else {
                setError("root", {
                    message: "Network error. Please try again."
                });
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-lg">
            <Toaster />
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Log In</h2>
            
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Show general form errors */}
                {errors.root && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.root.message}
                    </div>
                )}
                
                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            {...register("email")}
                            type="email"
                            placeholder="your@email.com"
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                {/* Password Input with Toggle */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyRound className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••"
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>

                {/* Forgot Password Link */}
                <div className="flex items-center justify-end">
                    <a href="#" className="text-sm text-emerald-600 hover:text-emerald-500">
                        Forgot your password?
                    </a>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Logging in...
                        </span>
                    ) : (
                        "Log In"
                    )}
                </button>
            </form>
        </div>
    );
}

export default LoginForm;