'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react'; // Update import
import { usePathname } from 'next/navigation';
import LoginModal from '../general/LoginModal';  // Add this import

const Navbar = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const currentLang = 'En';
  const currentCurrency = 'USD';
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);  // Add this state
  const userMenuRef = useRef<HTMLDivElement>(null); // Add this ref

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add this useEffect for handling clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    document.body.style.overflow = 'hidden';
  };

  return (
    <>
      <nav className={`flex items-center justify-between px-6 py-4 sm:px-5 md:px-5 xl:px-32 2xl:px-62 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomePage 
          ? isScrolled ? 'bg-white shadow-sm' : 'bg-gray-100'
          : isScrolled ? 'bg-white shadow-sm' : 'bg-white'
      }`}>
        {/* Left Section */}
        <div className="flex items-center space-x-20">
          <Link href="/">
            <Image src="/images/HiHome-Logo.webp" alt="Logo" width={144} height={40} />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-10 text-md">
            <Link href="/" className="text-black hover:text-primary">Home</Link>
            <Link href="/experience" className="text-black hover:text-primary">Experience</Link>
            <Link href="/stay" className="text-black hover:text-primary">Stay</Link>
            <Link href="/media" className="text-black hover:text-primary">Media</Link>
            <Link href="/blog" className="text-black hover:text-primary">Blog</Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Static Language/Currency Display */}
          <div className="hidden md:flex items-center">
            <span className="text-sm lg:text-md font-medium text-black">
              {currentLang}/{currentCurrency}
            </span>
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 cursor-pointer p-2"
            >
              <Image src="/images/usermenu.svg" alt="user menu" width={62} height={62} />
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-6 bg-white border border-gray-200 rounded-lg py-4 w-64 shadow-lg">
                <button 
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsUserMenuOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-black hover:text-primary w-full text-left cursor-pointer"
                >
                  <Image 
                    src="/images/login.svg" 
                    alt="Login" 
                    width={20} 
                    height={20} 
                    className="mr-3 " 
                  />
                  Log in 
                </button>
                <Link 
                  href="/wishlist" 
                  className="flex items-center px-4 py-2 text-black hover:text-primary"
                >
                  <Image 
                    src="/images/heart1.svg" 
                    alt="Wishlist" 
                    width={20} 
                    height={20} 
                    className="mr-3" 
                  />
                  Wish List
                </Link>
                <Link 
                  href="/help" 
                  className="flex items-center px-4 py-2 text-black hover:text-primary"
                >
                  <Image 
                    src="/images/help1.svg" 
                    alt="Help" 
                    width={20} 
                    height={20} 
                    className="mr-3" 
                  />
                  Help Center
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="block md:hidden p-2 rounded-full hover:bg-gray-200"
            onClick={openMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-primary/80 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-500 ease-in-out z-50 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <button onClick={closeMobileMenu} className="p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-sm font-medium text-black">
            {currentLang}/{currentCurrency}
          </span>
        </div>

        {/* Mobile Navigation Links */}
        <nav className="flex flex-col space-y-4 mt-6 px-4">
          <Link href="/" className="text-gray-700 hover:text-primary">Home</Link>
          <Link href="/experience" className="text-gray-700 hover:text-primary">Experience</Link>
          <Link href="/stay" className="text-gray-700 hover:text-primary">Stay</Link>
          <Link href="/media" className="text-gray-700 hover:text-primary">Media</Link>
          <Link href="/blog" className="text-gray-700 hover:text-primary">Blog</Link>
        </nav>
      </div>

      {/* Add LoginModal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
