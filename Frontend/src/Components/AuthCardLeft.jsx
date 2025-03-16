import React from 'react'

function AuthCardLeft() {
  return (
    <div className="flex h-screen w-1/2">
      {/* Left Side - Image and Content */}
        <div className="w-full relative bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950 flex flex-col items-center justify-center overflow-hidden">
            {/* Background pattern overlay */}
            <div className="absolute inset-0 opacity-10">
            <div className="absolute w-96 h-96 rounded-full bg-emerald-500 blur-3xl -top-20 -left-20"></div>
            <div className="absolute w-96 h-96 rounded-full bg-emerald-500 blur-3xl -bottom-20 -right-20"></div>
            </div>
            
            {/* Main content container */}
            <div className="z-10 w-4/5 flex flex-col items-center space-y-8">
            {/* App logo/name */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-white tracking-tight">FinTrack</h1>
                <p className="text-emerald-400 mt-2">Secure banking solutions</p>
            </div>
            
            {/* Main image */}
            <img
                src="/Banking_money.jpg"
                alt="Finance Illustration"
                className="w-full object-cover rounded-xl shadow-2xl"
            />
            
            {/* Testimonial or feature highlight */}
            <div className="mt-6 bg-black/30 p-4 rounded-lg border border-emerald-950/50 backdrop-blur-sm">
                <p className="text-gray-300 italic">"Managing finances has never been easier with this platform."</p>
                <p className="text-emerald-400 text-sm mt-2">— John Smith, Customer since 2023</p>
            </div>
            </div>
            
            {/* Footer */}
            <div className="absolute bottom-6 text-xs text-gray-500">
            © 2025 FinTrack. All rights reserved.
            </div>
        </div>
        </div>
    );
}

export default AuthCardLeft