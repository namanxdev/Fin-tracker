import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "../store/authStore"; 
import useThemeStore from "../store/themeStore";  // Add this import
import toast, { Toaster } from 'react-hot-toast';
import { Mail, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// Enhanced schema with better error messages
const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters")
});

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    
    const login = useAuthStore((state) => state.login);
    // Fix: Use useThemeStore instead of useAuthStore and call isDark as a function
    const isDark = useThemeStore((state) => state.isDark());
    
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
            const result = await login(data.email, data.password);
            // Check if login was actually successful
            if (result.success) {
                toast.success('Successfully LoggedIn!');
                reset();
                navigate("/"); // Redirect to dashboard or home page
            } else {
                // Handle auth failure based on returned error
                toast.error(result.error || "Login failed");
                setError("root", {
                    message: result.error || "Login failed"
                });
            } 
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
            toast.error(data.message || "An unexpected error occurred");
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
        <div className={`w-full max-w-md mx-auto rounded-lg shadow-lg p-6 mt-10 
            ${isDark 
                ? "bg-gray-900 text-white" 
                : "bg-white text-gray-900"}`}>
            <Toaster />
            <h2 className={`text-2xl font-bold mb-6 mx-4 text-center p-4 px-6 
                ${isDark ? "text-white" : "text-gray-800"}`}>Log In</h2>
            
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Show general form errors */}
                {errors.root && (
                    <div className={`p-3 rounded 
                        ${isDark 
                            ? "bg-red-900 border border-red-700 text-red-100" 
                            : "bg-red-50 border border-red-400 text-red-700"}`}>
                        {errors.root.message}
                    </div>
                )}
                
                {/* Email Input */}
                <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-1 
                        ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className={`h-5 w-5 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                        </div>
                        <input
                            id="email"
                            {...register("email")}
                            type="email"
                            placeholder="your@email.com"
                            className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                                ${isDark 
                                    ? "bg-gray-800 border-gray-700 text-white" 
                                    : "bg-white border-gray-300 text-gray-900"}`}
                        />
                    </div>
                    {errors.email && (
                        <p className={`mt-1 text-sm ${isDark ? "text-red-400" : "text-red-600"}`}>
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password Input with Toggle */}
                <div>
                    <label htmlFor="password" className={`block text-sm font-medium mb-1 
                        ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyRound className={`h-5 w-5 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                        </div>
                        <input
                            id="password"
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••"
                            className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                                ${isDark 
                                    ? "bg-gray-800 border-gray-700 text-white" 
                                    : "bg-white border-gray-300 text-gray-900"}`}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeOff className={`h-5 w-5 
                                    ${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`} />
                            ) : (
                                <Eye className={`h-5 w-5 
                                    ${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`} />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className={`mt-1 text-sm ${isDark ? "text-red-400" : "text-red-600"}`}>
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Forgot Password Link */}
                <div className="flex items-center justify-end">
                    <a href="#" className={`text-sm 
                        ${isDark 
                            ? "text-emerald-400 hover:text-emerald-300" 
                            : "text-emerald-600 hover:text-emerald-700"}`}>
                        Forgot your password?
                    </a>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                        ${isDark 
                            ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-offset-2 focus:ring-offset-gray-900" 
                            : "bg-emerald-600 hover:bg-emerald-700 focus:ring-offset-2"}`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <span className="loading loading-infinity loading-lg"></span>
                            Logging in...
                        </span>
                    ) : (
                        "Log In"
                    )}
                </button>
            </form>

            {/* OR divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className={`px-2 ${isDark ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'}`}>
                        Or continue with
                    </span>
                </div>
            </div>

            {/* Google Sign-in Button */}
            <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:3000/api/auth/google'}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 border rounded-md transition-colors
                    ${isDark 
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white' 
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'}`}
            >
                <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
            </button>

            {/* Registration prompt */}
            <div className="mt-6 text-center">
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Don't have an account? {' '}
                    <a 
                    href="/register" 
                    className={isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}
                    >
                    Register
                    </a>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;