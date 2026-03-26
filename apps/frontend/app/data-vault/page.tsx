'use client';

import React, { useState } from 'react';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';

// 模拟数据
const mockData = {
  preferences: [
    {
      id: 1,
      type: 'Size',
      value: 'M',
      category: 'Fashion',
      hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      created: '2026-03-20T10:30:00Z',
      monetized: true,
      earnings: 12.5
    },
    {
      id: 2,
      type: 'Brand',
      value: 'Nike, Adidas',
      category: 'Fashion',
      hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      created: '2026-03-19T14:20:00Z',
      monetized: false,
      earnings: 0
    },
    {
      id: 3,
      type: 'Color',
      value: 'Black, White, Gray',
      category: 'Fashion',
      hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      created: '2026-03-18T09:15:00Z',
      monetized: true,
      earnings: 8.3
    },
    {
      id: 4,
      type: 'Price Range',
      value: '¥200-¥500',
      category: 'Shopping',
      hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      created: '2026-03-17T16:45:00Z',
      monetized: true,
      earnings: 5.7
    },
    {
      id: 5,
      type: 'Material',
      value: 'Cotton, Wool',
      category: 'Fashion',
      hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      created: '2026-03-16T11:20:00Z',
      monetized: false,
      earnings: 0
    },
    {
      id: 6,
      type: 'Style',
      value: 'Minimal, Casual',
      category: 'Fashion',
      hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      created: '2026-03-15T13:10:00Z',
      monetized: true,
      earnings: 10.2
    },
    {
      id: 7,
      type: 'Brand Ban',
      value: 'Fast Fashion Brands',
      category: 'Preferences',
      hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      created: '2026-03-14T15:50:00Z',
      monetized: false,
      earnings: 0
    },
    {
      id: 8,
      type: 'Occasion',
      value: 'Work, Casual',
      category: 'Fashion',
      hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      created: '2026-03-13T10:00:00Z',
      monetized: true,
      earnings: 6.8
    }
  ],
  earnings: [
    {
      id: 1,
      date: '2026-03-25',
      amount: 2.5,
      source: 'Brand A',
      status: 'Completed'
    },
    {
      id: 2,
      date: '2026-03-24',
      amount: 3.2,
      source: 'Brand B',
      status: 'Completed'
    },
    {
      id: 3,
      date: '2026-03-23',
      amount: 1.8,
      source: 'Brand C',
      status: 'Pending'
    }
  ]
};

// 内联 SVG 图标
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const Trash2Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);

const DollarSignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

// 数据地图组件
const DataMap = ({ preferences, onSelect, selectedId }: any) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {preferences.map((pref: any) => (
        <div
          key={pref.id}
          className={`glass p-4 rounded-xl cursor-pointer transition-all ${selectedId === pref.id ? 'ring-2 ring-primary' : 'hover:neon-glow'}`}
          onClick={() => onSelect(pref)}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{pref.type}</h3>
            {pref.monetized && (
              <div className="flex items-center gap-1 text-green-500 text-xs">
                <DollarSignIcon />
                <span>Monetized</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{pref.value}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{pref.category}</span>
            <span>{new Date(pref.created).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// 销毁动画组件
const BurnAnimation = ({ onComplete }: any) => {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-red-500/20 animate-pulse"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-500 border-dashed rounded-full animate-spin"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Trash2Icon />
          <p className="text-red-500 font-medium">Burning Data...</p>
        </div>
      </div>
    </div>
  );
};

export default function DataVault() {
  const [selectedPreference, setSelectedPreference] = useState<any>(null);
  const [isBurning, setIsBurning] = useState(false);
  const [preferences, setPreferences] = useState(mockData.preferences);
  
  // 处理偏好选择
  const handleSelectPreference = (pref: any) => {
    setSelectedPreference(pref);
  };
  
  // 处理销毁数据
  const handleBurnData = () => {
    if (selectedPreference) {
      setIsBurning(true);
      // 模拟销毁过程
      setTimeout(() => {
        setPreferences(prev => prev.filter(pref => pref.id !== selectedPreference.id));
        setSelectedPreference(null);
        setIsBurning(false);
      }, 3000);
    }
  };
  
  // 处理变现授权
  const handleMonetize = () => {
    if (selectedPreference) {
      setPreferences(prev => prev.map(pref => 
        pref.id === selectedPreference.id ? { ...pref, monetized: true } : pref
      ));
      setSelectedPreference({ ...selectedPreference, monetized: true });
    }
  };
  
  // 计算总收益
  const totalEarnings = preferences.reduce((sum: number, pref: any) => sum + pref.earnings, 0);
  
  // 模拟钱包地址
  const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const truncatedAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 顶部导航栏 */}
      <TopNav currentPage="Data Vault" />

      {/* 主要内容区 */}
      <main className="flex-1 flex">
        {/* 侧边栏 */}
        <Sidebar currentPage="Data Vault" />

        {/* 中央内容区 */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* 页面标题 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Data Vault</h1>
              <p className="text-muted-foreground">0G 去中心化存储管理与隐私确权</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 数据地图 */}
              <div className="lg:col-span-2">
                <div className="glass p-6 rounded-xl mb-6">
                  <h2 className="text-xl font-semibold mb-4">Data Map</h2>
                  <p className="text-muted-foreground mb-6">Your encrypted preference fragments on 0G Storage</p>
                  <DataMap 
                    preferences={preferences} 
                    onSelect={handleSelectPreference}
                    selectedId={selectedPreference?.id}
                  />
                </div>
              </div>
              
              {/* 右侧面板 */}
              <div className="lg:col-span-1 space-y-6">
                {/* 偏好详情 */}
                <div className="glass p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4">Preference Details</h2>
                  {isBurning ? (
                    <div className="h-64 flex items-center justify-center">
                      <BurnAnimation onComplete={() => setIsBurning(false)} />
                    </div>
                  ) : selectedPreference ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm text-muted-foreground mb-1">Type</h3>
                        <p className="font-medium">{selectedPreference.type}</p>
                      </div>
                      <div>
                        <h3 className="text-sm text-muted-foreground mb-1">Value</h3>
                        <p className="font-medium">{selectedPreference.value}</p>
                      </div>
                      <div>
                        <h3 className="text-sm text-muted-foreground mb-1">Category</h3>
                        <p className="font-medium">{selectedPreference.category}</p>
                      </div>
                      <div>
                        <h3 className="text-sm text-muted-foreground mb-1">0G Storage Hash</h3>
                        <p className="font-mono text-xs bg-secondary p-2 rounded break-all">
                          {selectedPreference.hash}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm text-muted-foreground mb-1">Created</h3>
                        <p className="font-medium">{new Date(selectedPreference.created).toLocaleString()}</p>
                      </div>
                      <div>
                        <h3 className="text-sm text-muted-foreground mb-1">Monetization Status</h3>
                        <p className={`font-medium ${selectedPreference.monetized ? 'text-green-500' : 'text-yellow-500'}`}>
                          {selectedPreference.monetized ? 'Monetized' : 'Not Monetized'}
                        </p>
                      </div>
                      <div className="space-y-2 pt-2">
                        {!selectedPreference.monetized && (
                          <button 
                            onClick={handleMonetize}
                            className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:neon-glow transition-all flex items-center justify-center gap-2"
                          >
                            <DollarSignIcon />
                            Monetize
                          </button>
                        )}
                        <button 
                          onClick={handleBurnData}
                          className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2Icon />
                          Burn/Destroy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground">
                        <LockIcon />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No Preference Selected</h3>
                      <p className="text-muted-foreground">
                        Click on a data fragment to view details
                      </p>
                    </div>
                  )}
                </div>
                
                {/* 收益看板 */}
                <div className="glass p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4">Earnings Dashboard</h2>
                  <div className="mb-4">
                    <h3 className="text-sm text-muted-foreground mb-1">Total Earnings</h3>
                    <p className="text-3xl font-bold">{totalEarnings.toFixed(2)} 0G</p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium mb-2">Recent Rewards</h3>
                    {mockData.earnings.map((earning: any) => (
                      <div key={earning.id} className="flex items-center justify-between p-3 bg-secondary rounded-md">
                        <div>
                          <p className="font-medium">{earning.source}</p>
                          <p className="text-xs text-muted-foreground">{earning.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">+{earning.amount} 0G</p>
                          <p className={`text-xs ${earning.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                            {earning.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 底部信息栏 */}
      <footer className="glass border-t border-border p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Wallet:</span>
              <span className="text-sm font-mono">{truncatedAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">0G Token:</span>
              <span className="text-sm font-mono">1,234.56</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-secondary transition-colors">
              <SettingsIcon />
              <span className="text-sm">Agent Settings</span>
            </button>
            <p className="text-sm text-muted-foreground">© 2026 0G-ShopMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
