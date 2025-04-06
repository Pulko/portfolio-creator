import Link from 'next/link';
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="backdrop-blur-md bg-white/5 shadow-lg border border-white/10 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="text-3xl font-bold lowercase text-white">
          <Link href="/" className='cursor-pointer'>Portfolio</Link> <span className="text-xs font-light lowercase">by Pulko</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;