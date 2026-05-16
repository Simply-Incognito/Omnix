import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Send, Camera, Play, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900/80 border-t border-white/10 pt-20 pb-10 mt-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <span className="text-2xl font-outfit font-bold text-white tracking-tight">OMNIX</span>
            </Link>
            <p className="text-slate-400 leading-relaxed">
              Experience the future of multi-tenant commerce. Omnix connects premium brands with discerning customers worldwide through a seamless, high-performance marketplace.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 hover:bg-indigo-500/20 rounded-lg transition-colors text-slate-400 hover:text-indigo-400">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-indigo-500/20 rounded-lg transition-colors text-slate-400 hover:text-indigo-400">
                <Send size={20} />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-indigo-500/20 rounded-lg transition-colors text-slate-400 hover:text-indigo-400">
                <Camera size={20} />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-indigo-500/20 rounded-lg transition-colors text-slate-400 hover:text-indigo-400">
                <Play size={20} />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Shop Marketplace</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/shop" className="text-slate-400 hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/categories" className="text-slate-400 hover:text-white transition-colors">Featured Brands</Link></li>
              <li><Link to="/shop" className="text-slate-400 hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="text-slate-400 hover:text-white transition-colors">Limited Editions</Link></li>
              <li><Link to="/stores" className="text-slate-400 hover:text-white transition-colors">Verified Stores</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Our Company</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors">About Omnix</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors">Become a Vendor</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors">Press & Media</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors">Sustainability</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Get in Touch</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3 text-slate-400">
                <MapPin size={18} className="text-indigo-400" />
                <span>123 Innovation Way, Tech City, TC 94103</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone size={18} className="text-indigo-400" />
                <span>+1 (555) 888-0000</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail size={18} className="text-indigo-400" />
                <span>support@omnix-market.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            © 2026 Omnix Multi-Tenant Marketplace. Designed for excellence.
          </p>
          <div className="flex gap-8">
            <Link to="#" className="text-slate-500 hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-slate-500 hover:text-white text-xs transition-colors">Terms of Service</Link>
            <Link to="#" className="text-slate-500 hover:text-white text-xs transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
