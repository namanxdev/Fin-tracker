import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "../../store/authStore"; // Import the auth store

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
      // Use the register function from the auth store
      await register(data.email, data.password, data.name);
      console.log("Registration successful");
      reset(); // Clear form on success
    } catch (error) {
      // Handle different error responses
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
      } else {
        setError("root", {
          message: "Network error. Please try again."
        });
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
      
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Show general form errors */}
        {errors.root && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.root.message}
          </div>
        )}
        
        {/* Username Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="name"
            {...registerField("name")}
            type="text"
            placeholder="Username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
          {!errors.name && (
            <p className="mt-1 text-xs text-gray-500">
              Must be 3 to 30 characters containing only letters, numbers or dash
            </p>
          )}
        </div>
        
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            {...registerField("email")}
            type="email"
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            {...registerField("password")}
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
          {!errors.password && (
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters, including:
              <br />• At least one number
              <br />• At least one lowercase letter
              <br />• At least one uppercase letter
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </span>
          ) : (
            "Register"
          )}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;