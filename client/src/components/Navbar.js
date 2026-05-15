import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6'}`}>
      <div className={`container mx-auto px-6`}>
        <div className={`flex items-center justify-between glass px-6 py-3 rounded-2xl transition-all duration-300 ${isScrolled ? 'shadow-premium' : ''}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight font-outfit text-white">OMNIX</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-sm font-medium hover:text-indigo-400 transition-colors">Shop</Link>
            <Link to="/categories" className="text-sm font-medium hover:text-indigo-400 transition-colors">Categories</Link>
            <Link to="/stores" className="text-sm font-medium hover:text-indigo-400 transition-colors">Stores</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <Search size={20} className="text-slate-400" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
              <ShoppingBag size={20} className="text-slate-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <Link to="/login" className="hidden md:flex items-center gap-2 btn-primary !py-2 !px-5 !text-sm">
              <User size={16} />
              Sign In
            </Link>
            <button 
              className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 px-6 py-4"
          >
            <div className="glass rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
              <Link to="/shop" className="text-lg font-medium">Shop</Link>
              <Link to="/categories" className="text-lg font-medium">Categories</Link>
              <Link to="/stores" className="text-lg font-medium">Stores</Link>
              <hr className="border-white/10" />
              <Link to="/login" className="flex items-center gap-2 text-indigo-400 font-bold">
                <User size={20} />
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
