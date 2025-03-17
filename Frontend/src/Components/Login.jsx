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
        </div>
    );
}

export default LoginForm;