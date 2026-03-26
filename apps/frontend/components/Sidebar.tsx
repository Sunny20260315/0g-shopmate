'use client';

import React, { useState } from 'react';

interface SidebarProps {
  currentPage?: string;
}

// 内联 SVG 图标
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const MessageSquareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"></path>
    <path d="M18 17V9"></path>
    <path d="M13 17V5"></path>
    <path d="M8 17v-3"></path>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const DollarSignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const navItems = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/concierge', label: 'Concierge', icon: MessageSquareIcon },
  { href: '/omni-monitor', label: 'Omni-Monitor', icon: BarChartIcon },
  { href: '/data-vault', label: 'Data Vault', icon: LockIcon },
  { href: '/settlement', label: 'Settlement', icon: DollarSignIcon },
];

export default function Sidebar({ currentPage }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`glass ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex justify-between items-center">
        <h2 className={`font-semibold ${isCollapsed ? 'hidden' : 'block'}`}>Navigation</h2>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-1 rounded hover:bg-secondary transition-colors"
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.label;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                isActive
                  ? 'bg-secondary text-primary'
                  : 'hover:bg-secondary'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <Icon />
              </div>
              {!isCollapsed && <span>{item.label}</span>}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
