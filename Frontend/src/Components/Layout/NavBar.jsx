import React, { useState } from 'react';

function NavBar() {
    const [activeItem, setActiveItem] = useState('DashBoard');

    const navItems = ['DashBoard', 'Expenses', 'Income', 'Budget', 'Reports'];

    return (
        <div className="flex justify-center items-center bg-transparent p-4 w-full">
            <div className='flex flex-row items-center bg-white bg-opacity-20 backdrop-blur-md rounded-full p-2 shadow-lg mx-auto border border-white border-opacity-30'>
                <div className="flex flex-row space-x-1">
                    {navItems.map((item) => (
                        <div 
                            key={item}
                            className={`px-4 py-2 rounded-full cursor-pointer transition-colors duration-200 ${
                                activeItem === item 
                                ? 'bg-green-400 bg-opacity-30 text-black font-medium' 
                                : 'text-gray-700 hover:bg-gray-200 hover:bg-opacity-30'
                            }`}
                            onClick={() => setActiveItem(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NavBar;