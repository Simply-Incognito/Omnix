import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Zap, Globe, ShoppingBag } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -mr-64 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -ml-48 -mb-24"></div>

        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-6">
                THE FUTURE OF COMMERCE
              </span>
              <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
                Shop the <span className="text-gradient">Extraordinary</span>
              </h1>
              <p className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed">
                Omnix is a curated multi-tenant marketplace bringing the world's most innovative brands directly to your doorstep. Experience premium shopping like never before.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary text-lg">
                  Explore Marketplace
                  <ArrowRight size={20} />
                </button>
                <button className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all text-lg font-medium">
                  Be a Vendor
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-12 mt-16">
                <div>
                  <h4 className="text-3xl font-bold text-white">50k+</h4>
                  <p className="text-slate-500 text-sm uppercase tracking-wider">Products</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-white">1.2k+</h4>
                  <p className="text-slate-500 text-sm uppercase tracking-wider">Top Brands</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-white">99%</h4>
                  <p className="text-slate-500 text-sm uppercase tracking-wider">Satisfaction</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative z-10 glass-card p-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Premium Product" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute top-8 right-8 glass px-4 py-2 rounded-xl flex items-center gap-2">
                  <Star className="text-amber-400 fill-amber-400" size={16} />
                  <span className="font-bold">4.9/5 Rating</span>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-slate-900/50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Omnix?</h2>
            <p className="text-slate-400">We redefine the e-commerce experience with cutting-edge technology and a focus on premium quality.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="text-indigo-400" />, title: "Secure Payments", desc: "Enterprise-grade encryption for every transaction you make." },
              { icon: <Zap className="text-amber-400" />, title: "Hyper Fast", desc: "Optimized performance for a seamless shopping experience." },
              { icon: <Globe className="text-emerald-400" />, title: "Global Reach", desc: "Connecting vendors and customers from across the globe." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass-card p-10 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products (Simplified Grid) */}
      <section className="section-padding">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-slate-400">Handpicked items from our top vendors this week.</p>
            </div>
            <button className="text-indigo-400 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All Products <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="glass-card group overflow-hidden">
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`} 
                    alt="Product" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded">
                    NEW ARRIVAL
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-2">Electronics</p>
                  <h3 className="text-lg font-bold mb-2 truncate">Premium Wireless Headphones</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-white">$299.00</span>
                    <button className="p-2 bg-white/5 rounded-lg hover:bg-indigo-500 transition-colors">
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
