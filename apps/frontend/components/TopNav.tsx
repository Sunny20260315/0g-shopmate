'use client';

import React, { useState } from 'react';

interface TopNavProps {
  currentPage?: string;
}

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/concierge', label: 'Concierge' },
  { href: '/omni-monitor', label: 'Omni-Monitor' },
  { href: '/data-vault', label: 'Data Vault' },
  { href: '/settlement', label: 'Settlement' },
];

export default function TopNav({ currentPage }: TopNavProps) {
  const [isConnected, setIsConnected] = useState(true);

  return (
    <header className="sticky top-0 z-50 glass px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* 项目 Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="font-bold text-primary-foreground">SM</span>
          </div>
          <h1 className="text-xl font-bold">ShopMate</h1>
        </div>
        
        {/* 0G Node 连接状态灯 */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm">0G Node {isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
      
      {/* 主导航 */}
      <nav className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`transition-colors ${
              currentPage === item.label
                ? 'text-primary font-medium'
                : 'hover:text-primary'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
      
      {/* 移动端菜单按钮 */}
      <button className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="12" x2="20" y2="12"></line>
          <line x1="4" y1="6" x2="20" y2="6"></line>
          <line x1="4" y1="18" x2="20" y2="18"></line>
        </svg>
      </button>
    </header>
  );
}
