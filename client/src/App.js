import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Placeholder title="Marketplace" />} />
            <Route path="/categories" element={<Placeholder title="Categories" />} />
            <Route path="/stores" element={<Placeholder title="Verified Stores" />} />
            <Route path="/login" element={<Placeholder title="Sign In" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

const Placeholder = ({ title }) => (
  <div className="section-padding container text-center">
    <h2 className="text-4xl font-bold mb-4">{title}</h2>
    <p className="text-slate-400">This section is coming soon. We are building something extraordinary.</p>
    <div className="mt-8">
      <a href="/" className="btn-primary">Return Home</a>
    </div>
  </div>
);

export default App;
