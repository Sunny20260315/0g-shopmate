'use client';

import React, { useState, useEffect } from 'react';
import { walletService } from '@/app/lib/wallet';

// 模拟数据
const mockTransactions = [
  {
    id: 1,
    taskId: 'TASK-2026-001',
    date: '2026-03-25',
    action: 'Buy',
    amount: -299.00,
    currency: '0G',
    status: 'Completed',
    description: 'Black Hoodie',
    agentSig: 'Signed',
    hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0x876543210fedcba9876543210fedcba987654321',
    savings: 50.00,
    distribution: {
      user: 70,
      agent: 20,
      node: 10
    }
  },
  {
    id: 2,
    taskId: 'TASK-2026-002',
    date: '2026-03-24',
    action: 'Refund',
    amount: 12.50,
    currency: '0G',
    status: 'Completed',
    description: 'Data Monetization',
    agentSig: 'Signed',
    hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
    from: '0x9876543210fedcba9876543210fedcba98765432',
    to: '0x1234567890abcdef1234567890abcdef12345678',
    savings: 12.50,
    distribution: {
      user: 70,
      agent: 20,
      node: 10
    }
  },
  {
    id: 3,
    taskId: 'TASK-2026-003',
    date: '2026-03-23',
    action: 'Buy',
    amount: -499.00,
    currency: '0G',
    status: 'Completed',
    description: 'White Sneakers',
    agentSig: 'Signed',
    hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0x876543210fedcba9876543210fedcba987654321',
    savings: 80.00,
    distribution: {
      user: 70,
      agent: 20,
      node: 10
    }
  },
  {
    id: 4,
    taskId: 'TASK-2026-004',
    date: '2026-03-22',
    action: 'Refund',
    amount: 8.30,
    currency: '0G',
    status: 'Completed',
    description: 'Data Monetization',
    agentSig: 'Signed',
    hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
    from: '0x9876543210fedcba9876543210fedcba98765432',
    to: '0x1234567890abcdef1234567890abcdef12345678',
    savings: 8.30,
    distribution: {
      user: 70,
      agent: 20,
      node: 10
    }
  },
  {
    id: 5,
    taskId: 'TASK-2026-005',
    date: '2026-03-21',
    action: 'Buy',
    amount: -399.00,
    currency: '0G',
    status: 'Pending',
    description: 'Blue Jeans',
    agentSig: 'Pending',
    hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0x876543210fedcba9876543210fedcba987654321',
    savings: 60.00,
    distribution: {
      user: 70,
      agent: 20,
      node: 10
    }
  }
];

// 内联 SVG 图标
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const DollarSignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 7h10v10"></path>
    <path d="M7 17 17 7"></path>
  </svg>
);

const ArrowDownLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 17H7V7"></path>
    <path d="M17 7 7 17"></path>
  </svg>
);

export default function Settlement() {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [transactions] = useState(mockTransactions);
  
  // 计算总余额
  const totalBalance = transactions.reduce((sum: number, tx: any) => sum + tx.amount, 0);
  
  // 处理交易选择
  const handleSelectTransaction = (tx: any) => {
    setSelectedTransaction(tx);
  };
  
  // 从钱包服务获取地址
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  useEffect(() => {
    const unsubscribe = walletService.onStateChange((state) => {
      setWalletAddress(state.address);
    });
    return unsubscribe;
  }, []);
  
  const truncatedAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not connected';
  
  return (
    <>
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* 页面标题 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Settlement</h1>
              <p className="text-muted-foreground">Automated transaction and rewards distribution</p>
            </div>
            
            {/* 余额卡片 */}
            <div className="glass p-6 rounded-xl mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Total Balance</h2>
                  <p className="text-4xl font-bold">{totalBalance.toFixed(2)} 0G</p>
                </div>
                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:neon-glow transition-all flex items-center gap-2">
                    <ArrowUpRightIcon />
                    Send
                  </button>
                  <button className="px-4 py-2 border border-border rounded-md hover:border-primary transition-all flex items-center gap-2">
                    <ArrowDownLeftIcon />
                    Receive
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 交易列表 */}
              <div className="lg:col-span-2">
                <div className="glass p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className={`glass p-4 rounded-lg cursor-pointer transition-all ${selectedTransaction?.id === tx.id ? 'ring-2 ring-primary' : 'hover:neon-glow'}`}
                        onClick={() => handleSelectTransaction(tx)}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                          <div>
                            <h3 className="text-sm text-muted-foreground">Task ID</h3>
                            <p className="font-medium">{tx.taskId}</p>
                          </div>
                          <div>
                            <h3 className="text-sm text-muted-foreground">Action</h3>
                            <p className={`font-medium ${tx.action === 'Buy' ? 'text-blue-500' : 'text-green-500'}`}>
                              {tx.action}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm text-muted-foreground">Agent Sig</h3>
                            <p className={`font-medium ${tx.agentSig === 'Signed' ? 'text-green-500' : 'text-yellow-500'}`}>
                              {tx.agentSig}
                            </p>
                          </div>
                          <div className="text-right">
                            <h3 className="text-sm text-muted-foreground">Amount</h3>
                            <p className={`font-medium ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.currency}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm text-muted-foreground">Description</h3>
                            <p className="font-medium">{tx.description}</p>
                          </div>
                          <div className="text-right">
                            <h3 className="text-sm text-muted-foreground">0G Tx Hash</h3>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://explorer.0g.ai/tx/${tx.hash}`, '_blank');
                              }}
                              className="font-mono text-xs text-primary hover:underline break-all"
                            >
                              {tx.hash.slice(0, 12)}...
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 交易详情 */}
              <div className="lg:col-span-1">
                <div className="glass p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
                  {selectedTransaction ? (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm text-muted-foreground mb-1">Task ID</h3>
                          <p className="font-medium">{selectedTransaction.taskId}</p>
                        </div>
                        <div>
                          <h3 className="text-sm text-muted-foreground mb-1">Action</h3>
                          <p className={`font-medium ${selectedTransaction.action === 'Buy' ? 'text-blue-500' : 'text-green-500'}`}>
                            {selectedTransaction.action}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm text-muted-foreground mb-1">Amount</h3>
                          <p className={`font-medium ${selectedTransaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {selectedTransaction.amount > 0 ? '+' : ''}{selectedTransaction.amount} {selectedTransaction.currency}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm text-muted-foreground mb-1">Date</h3>
                          <p className="font-medium">{selectedTransaction.date}</p>
                        </div>
                        <div>
                          <h3 className="text-sm text-muted-foreground mb-1">Status</h3>
                          <p className={`font-medium ${selectedTransaction.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                            {selectedTransaction.status}
                          </p>
                        </div>
                      </div>
                      
                      {/* 分红模型预览 */}
                      <div className="pt-6 border-t border-border">
                        <h3 className="text-lg font-semibold mb-4">Profit Distribution</h3>
                        <div className="flex flex-col items-center">
                          {/* 饼图 */}
                          <div className="w-40 h-40 mb-4 relative">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                              <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="none" 
                                stroke="#10B981" 
                                strokeWidth="20" 
                                strokeDasharray={`${(selectedTransaction.distribution.user / 100) * 251.2} ${251.2 - (selectedTransaction.distribution.user / 100) * 251.2}`}
                                strokeDashoffset="0"
                                transform="rotate(-90 50 50)"
                              />
                              <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="none" 
                                stroke="#3B82F6" 
                                strokeWidth="20" 
                                strokeDasharray={`${(selectedTransaction.distribution.agent / 100) * 251.2} ${251.2 - (selectedTransaction.distribution.agent / 100) * 251.2}`}
                                strokeDashoffset={`-${(selectedTransaction.distribution.user / 100) * 251.2}`}
                                transform="rotate(-90 50 50)"
                              />
                              <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="none" 
                                stroke="#8B5CF6" 
                                strokeWidth="20" 
                                strokeDasharray={`${(selectedTransaction.distribution.node / 100) * 251.2} ${251.2 - (selectedTransaction.distribution.node / 100) * 251.2}`}
                                strokeDashoffset={`-${(selectedTransaction.distribution.user + selectedTransaction.distribution.agent) / 100 * 251.2}`}
                                transform="rotate(-90 50 50)"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-2xl font-bold">{selectedTransaction.savings.toFixed(2)} 0G</p>
                                <p className="text-xs text-muted-foreground">Total Savings</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* 图例 */}
                          <div className="w-full space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm">User</span>
                              </div>
                              <span className="text-sm font-medium">{selectedTransaction.distribution.user}% ({(selectedTransaction.savings * selectedTransaction.distribution.user / 100).toFixed(2)} 0G)</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm">Agent</span>
                              </div>
                              <span className="text-sm font-medium">{selectedTransaction.distribution.agent}% ({(selectedTransaction.savings * selectedTransaction.distribution.agent / 100).toFixed(2)} 0G)</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span className="text-sm">0G Node</span>
                              </div>
                              <span className="text-sm font-medium">{selectedTransaction.distribution.node}% ({(selectedTransaction.savings * selectedTransaction.distribution.node / 100).toFixed(2)} 0G)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground">
                        <DollarSignIcon />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No Transaction Selected</h3>
                      <p className="text-muted-foreground">
                        Click on a transaction to view details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

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
    </>
  );
}
