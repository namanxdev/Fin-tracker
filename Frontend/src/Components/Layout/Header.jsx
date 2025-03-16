import React from 'react';
import NavBar from './NavBar';
import { Landmark, Menu, UserRound } from 'lucide-react';
import ThemeToggle from '../Theme/ThemeToggle';

function Header() {
  return (
        <div className=" bg-opacity-30 backdrop-blur-md block w-full h-20 shadow-md rounded-b-lg">
        <div className="flex flex-row justify-between items-center h-full px-4">
            <div className="flex flex-row items-center ml-2">
            <Landmark alt="Logo" className="h-10 w-12 text-black" />
            <h1 className="text-2xl font-bold ml-2 text-green-400">FinTrack</h1>
            </div>
            <NavBar />
            <div className='flex flex-row items-center mr-2 space-x-2'>
                {/* Toggle Themes */}
                <div className='mr-2'>
                    <ThemeToggle/>
                </div>
                <div className="flex flex-row items-center">
                <button className="flex flex-row items-center justify-center bg-white bg-opacity-20 backdrop-blur-md rounded-full p-4 mr-2 shadow-lg border border-gray-300 hover:border-black">
                    <div>
                    <Menu className="text-black mr-1.5" />
                    </div>
                    <div>
                    {/* <img src="" alt="" /> TODO:Implement later */}
                    <UserRound className="text-black" />
                    </div>
                </button>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Header;
