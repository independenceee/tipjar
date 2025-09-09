"use client";

import { Menu, Home } from "lucide-react";
import Link from "next/link";
import { DocHeaderProps } from '~/constants/docs';

export default function DocHeader({ onMenuClick }: DocHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="p-4 lg:p-6">
        <div className="lg:hidden flex items-center justify-between mb-4">
          
          <button 
            className="p-2 text-gray-500 hover:text-gray-700" 
            onClick={onMenuClick}
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100 rounded-md"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 