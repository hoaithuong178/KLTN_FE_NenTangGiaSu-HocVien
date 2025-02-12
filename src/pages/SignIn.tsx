import React, { useState, useEffect } from 'react';
import Kein1 from '../assets/Kein.jpg';
import Kein2 from '../assets/Kein.jpg';
import Kein3 from '../assets/Kein.jpg';
import Facebook from '../assets/facebook.svg';
import Google from '../assets/google.svg';
const SignIn = () => {
    const images = [Kein1, Kein2, Kein3];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Slide Section */}
            <div className="w-1/2 flex justify-center items-center bg-gray-100 overflow-hidden relative">
                <div
                    className="flex transition-transform duration-1000 ease-in-out"
                    style={{
                        transform: `translateX(-${currentImageIndex * 100}%)`,
                    }}
                >
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-96 object-cover rounded-2xl flex-shrink-0"
                        />
                    ))}
                </div>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${
                                index === currentImageIndex ? 'bg-[#ffc569]' : 'bg-gray-400'
                            } transition-all duration-300`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Login Form Section */}
            <div className="w-1/2 flex flex-col justify-center items-center px-10">
                <h2 className="text-3xl font-bold mb-8 text-[#1b223b]">Đăng nhập</h2>
                <form className="w-full max-w-sm">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#ffc569] focus:border-[#ffc569]"
                            placeholder="email"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#ffc569] focus:border-[#ffc569]"
                            placeholder="password"
                        />
                    </div>
                    <div className="text-right mt-4">
                        <a href="#" className="text-sm text-[#1b223b] font-medium hover:underline">
                            Forgot Password?
                        </a>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <button
                            type="submit"
                            className="w-full bg-[#ffc569] text-[#1b223b] py-2 px-4 rounded-lg font-medium hover:bg-[#f9b24e] transition duration-300"
                        >
                            Sign In
                        </button>
                    </div>

                    <div className="text-center text-gray-500 mb-4">or</div>

                    <div className="flex flex-col space-y-4">
                        <button className="w-full border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                            <img src={Google} alt="Google logo" className="w-6 h-6 mr-2" />
                            Login with Google
                        </button>
                        <button className="w-full border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                            <img src={Facebook} alt="Facebook logo" className="w-6 h-6 mr-2" />
                            Login with Facebook
                        </button>
                    </div>
                </form>

                <div className="text-sm text-gray-600 mt-4">
                    Don't have an account yet?{' '}
                    <a href="#" className="text-[#1b223b] font-medium hover:underline">
                        Sign up
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
