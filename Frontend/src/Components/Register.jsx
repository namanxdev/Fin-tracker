import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "../store/authStore"; 
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { User, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';
import useThemeStore from "../store/themeStore";

// Enhanced schema with better error messages
const schema = z.object({
    name: z.string().min(3, "Username must be at least 3 characters")
        .regex(/^[A-Za-z][A-Za-z0-9\-]*$/, "Username can only contain letters, numbers, or dashes"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters")
        .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        "Password must include at least one number, one lowercase letter, and one uppercase letter"
        )
});

function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const isDark = useThemeStore((state) => state.isDark());
    
    // Get the register function from auth store
    const register = useAuthStore((state) => state.register);
    
    const {
        register: registerField,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        reset
    } = useForm({
        defaultValues: {
        name: "",
        email: "",
        password: ""
        },
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            const result = await register(data.email, data.password, data.name);
            toast.success('Registration successful!');
            reset();
            navigate("/login"); // Redirect to login page after successful registration
        } catch (error) {
            // Error handling
            if (error.response) {
                const { status, data } = error.response;
                
                if (status === 409) {
                    setError("email", {
                        message: "Email already exists"
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
                toast.error(data.message || "Registration failed");
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
        <div className={`w-full ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            <Toaster />
            
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Show general form errors */}
                {errors.root && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.root.message}
                    </div>
                )}
                
                {/* Username Input */}
                <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Username
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="name"
                            {...registerField("name")}
                            type="text"
                            placeholder="Username"
                            className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                                ${isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                    </div>
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                    {!errors.name && (
                        <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Must be 3+ characters (letters, numbers, dashes)
                        </p>
                    )}
                </div>
                
                {/* Email Input */}
                <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            {...registerField("email")}
                            type="email"
                            placeholder="your@email.com"
                            className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                                ${isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* Password Input with toggle */}
                <div>
                    <label htmlFor="password" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyRound className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            {...registerField("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                                ${isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeOff className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700`} />
                            ) : (
                                <Eye className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700`} />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                    )}
                    {!errors.password && (
                        <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Min. 8 characters with number, lowercase & uppercase
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <span className="loading loading-infinity loading-lg"></span>
                            Registering...
                        </span>
                    ) : (
                        "Create Account"
                    )}
                </button>
            </form>
        </div>
    );
}

export default RegisterForm;