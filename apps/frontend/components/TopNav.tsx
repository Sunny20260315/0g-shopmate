'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WalletConnect from './WalletConnect';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/concierge', label: 'Concierge' },
  { href: '/omni-monitor', label: 'Omni-Monitor' },
  { href: '/data-vault', label: 'Data Vault' },
  { href: '/settlement', label: 'Settlement' },
];

export default function TopNav() {
  // 🔑 用 usePathname 代替 props 传入的 currentPage
  //   这样 TopNav 放在 layout 中也能自动感知当前路由
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 glass px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="font-bold text-primary-foreground">SM</span>
          </div>
          <h1 className="text-xl font-bold">ShopMate</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm">0G Node Connected</span>
        </div>
      </div>

      {/* 🔑 用 Next.js <Link> 代替 <a>，实现客户端路由（不整页刷新） */}
      <nav className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`transition-colors ${
              isActive(item.href)
                ? 'text-primary font-medium'
                : 'hover:text-primary'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hidden md:block">
        <WalletConnect />
      </div>

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
