'use client';

import React, { useState, useEffect } from 'react';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';

// 生成模拟数据
const generateMockData = () => {
  const items = [];
  const categories = ['Electronics', 'Fashion', 'Home', 'Sports'];
  const names = ['Smartphone', 'Laptop', 'Hoodie', 'Sneakers', 'Headphones', 'Watch', 'Chair', 'Bike'];
  
  for (let i = 0; i < 8; i++) {
    // 生成价格数据
    const web2Prices = [];
    const web3Prices = [];
    for (let j = 0; j < 30; j++) {
      const basePrice = 100 + Math.random() * 900;
      web2Prices.push(basePrice - Math.random() * 50);
      web3Prices.push(basePrice - Math.random() * 80);
    }
    
    items.push({
      id: i + 1,
      name: names[i % names.length],
      category: categories[i % categories.length],
      image: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${names[i % names.length].toLowerCase().replace(' ', '%20')}%20product%20minimal%20design&image_size=square`,
      web2Price: web2Prices[web2Prices.length - 1].toFixed(2),
      web3Price: web3Prices[web3Prices.length - 1].toFixed(2),
      priceChange: (Math.random() * 20 - 10).toFixed(2),
      web2Prices,
      web3Prices,
      proofStatus: Math.random() > 0.3, // 70% 概率有证据
      proofId: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      lastSnapshot: new Date().toISOString(),
    });
  }
  
  return items;
};

// 内联 SVG 图标
const BarChart3Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"></path>
    <path d="M18 17V9"></path>
    <path d="M13 17V5"></path>
    <path d="M8 17v-3"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const AlertCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const CheckCircle2Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9 12l2 2 4-4"></path>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

// 折线图组件
const LineChart = ({ web2Prices, web3Prices, onHover }: any) => {
  const [hoverPoint, setHoverPoint] = useState<number | null>(null);
  
  // 计算图表数据
  const maxPrice = Math.max(...web2Prices, ...web3Prices);
  const minPrice = Math.min(...web2Prices, ...web3Prices);
  const priceRange = maxPrice - minPrice;
  
  // 生成路径
  const web2Path = web2Prices.map((price: number, index: number) => {
    const x = (index / (web2Prices.length - 1)) * 100;
    const y = 100 - ((price - minPrice) / priceRange) * 100;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  const web3Path = web3Prices.map((price: number, index: number) => {
    const x = (index / (web3Prices.length - 1)) * 100;
    const y = 100 - ((price - minPrice) / priceRange) * 100;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const index = Math.floor(percentage * (web2Prices.length - 1));
    setHoverPoint(index);
    if (onHover) {
      onHover(index);
    }
  };
  
  const handleMouseLeave = () => {
    setHoverPoint(null);
    if (onHover) {
      onHover(null);
    }
  };
  
  return (
    <svg 
      width="100%" 
      height="120" 
      className="cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 网格线 */}
      <g className="text-muted-foreground/20">
        <line x1="0" y1="20" x2="100%" y2="20" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="60" x2="100%" y2="60" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="100" x2="100%" y2="100" stroke="currentColor" strokeWidth="1" />
      </g>
      
      {/* Web2 价格线 */}
      <path 
        d={web2Path} 
        fill="none" 
        stroke="#64FFDA" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      
      {/* Web3 价格线 */}
      <path 
        d={web3Path} 
        fill="none" 
        stroke="#FF64DA" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      
      {/* 数据点 */}
      {web2Prices.map((price: number, index: number) => {
        const x = (index / (web2Prices.length - 1)) * 100;
        const y = 100 - ((price - minPrice) / priceRange) * 100;
        return (
          <circle 
            key={`web2-${index}`}
            cx={x} 
            cy={y} 
            r="2" 
            fill="#64FFDA" 
            className="opacity-50"
          />
        );
      })}
      
      {web3Prices.map((price: number, index: number) => {
        const x = (index / (web3Prices.length - 1)) * 100;
        const y = 100 - ((price - minPrice) / priceRange) * 100;
        return (
          <circle 
            key={`web3-${index}`}
            cx={x} 
            cy={y} 
            r="2" 
            fill="#FF64DA" 
            className="opacity-50"
          />
        );
      })}
      
      {/* 悬停十字准星 */}
      {hoverPoint !== null && (
        <g>
          <line 
            x1={(hoverPoint / (web2Prices.length - 1)) * 100} 
            y1="0" 
            x2={(hoverPoint / (web2Prices.length - 1)) * 100} 
            y2="120" 
            stroke="#64FFDA" 
            strokeWidth="1" 
            strokeDasharray="2,2"
          />
          <line 
            x1="0" 
            y1={100 - ((web2Prices[hoverPoint] - minPrice) / priceRange) * 100} 
            x2="100%" 
            y2={100 - ((web2Prices[hoverPoint] - minPrice) / priceRange) * 100} 
            stroke="#64FFDA" 
            strokeWidth="1" 
            strokeDasharray="2,2"
          />
          <circle 
            cx={(hoverPoint / (web2Prices.length - 1)) * 100} 
            cy={100 - ((web2Prices[hoverPoint] - minPrice) / priceRange) * 100} 
            r="4" 
            fill="#64FFDA" 
          />
          <circle 
            cx={(hoverPoint / (web3Prices.length - 1)) * 100} 
            cy={100 - ((web3Prices[hoverPoint] - minPrice) / priceRange) * 100} 
            r="4" 
            fill="#FF64DA" 
          />
        </g>
      )}
    </svg>
  );
};

export default function OmniMonitor() {
  const [items, setItems] = useState(generateMockData());
  const [isConnected, setIsConnected] = useState(true);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [alertPrice, setAlertPrice] = useState('');
  const [agentId, setAgentId] = useState('');
  const [hoverItem, setHoverItem] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  
  // 模拟 0G Node 连接状态
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(prev => Math.random() > 0.1); // 90% 概率连接
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // 计算统计数据
  const totalTrackedItems = items.length;
  const priceDrops = items.filter(item => parseFloat(item.priceChange) < 0).length;
  
  // 处理预警设置
  const handleSetAlert = () => {
    if (selectedItem && alertPrice && agentId) {
      // 这里可以添加预警设置逻辑
      console.log('Setting alert for:', selectedItem.name);
      console.log('Price threshold:', alertPrice);
      console.log('Agent ID:', agentId);
      setIsAlertModalOpen(false);
      setAlertPrice('');
      setAgentId('');
      setSelectedItem(null);
    }
  };
  
  // 处理商品悬停
  const handleItemHover = (index: number) => {
    setHoverItem(index);
  };
  
  const handleItemLeave = () => {
    setHoverItem(null);
    setHoverIndex(null);
  };
  
  // 处理图表悬停
  const handleChartHover = (itemIndex: number, dataIndex: number | null) => {
    setHoverIndex(dataIndex);
  };
  
  // 模拟钱包地址
  const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const truncatedAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 顶部导航栏 */}
      <TopNav currentPage="Omni-Monitor" />

      {/* 主要内容区 */}
      <main className="flex-1 flex">
        {/* 侧边栏 */}
        <Sidebar currentPage="Omni-Monitor" />

        {/* 中央内容区 */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* 页面标题 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Omni-Monitor</h1>
              <p className="text-muted-foreground">Web2 与 Web3 价格对标及预警管理</p>
            </div>
            
            {/* 顶部统计 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="glass p-6 rounded-xl">
                <h3 className="text-muted-foreground mb-2">Total Tracked Items</h3>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">{totalTrackedItems}</span>
                  <span className="text-sm text-green-500">+2 today</span>
                </div>
              </div>
              <div className="glass p-6 rounded-xl">
                <h3 className="text-muted-foreground mb-2">Price Drops</h3>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">{priceDrops}</span>
                  <span className="text-sm text-green-500">{((priceDrops / totalTrackedItems) * 100).toFixed(1)}% of items</span>
                </div>
              </div>
            </div>
            
            {/* 主列表 */}
            <div className="space-y-4 mb-8">
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="glass rounded-xl overflow-hidden hover:neon-glow transition-all"
                  onMouseEnter={() => handleItemHover(index)}
                  onMouseLeave={handleItemLeave}
                >
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* 商品缩略图 */}
                      <div className="md:col-span-2">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-24 object-cover rounded-md"
                        />
                      </div>
                      
                      {/* 商品信息 */}
                      <div className="md:col-span-3">
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Web2 Price</p>
                            <p className="font-medium">¥{item.web2Price}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Web3 Price</p>
                            <p className="font-medium text-primary">¥{item.web3Price}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* 价格走势图 */}
                      <div className="md:col-span-5">
                        <div className="mb-2 flex justify-between items-center">
                          <h4 className="text-sm font-medium">Price Trend (30d)</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-primary rounded-full"></div>
                              <span className="text-xs">Web2</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                              <span className="text-xs">Web3</span>
                            </div>
                          </div>
                        </div>
                        <LineChart 
                          web2Prices={item.web2Prices} 
                          web3Prices={item.web3Prices}
                          onHover={(dataIndex) => handleChartHover(index, dataIndex)}
                        />
                        {hoverItem === index && hoverIndex !== null && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            0G Storage Snapshot ID: {item.proofId.slice(0, 16)}...
                          </div>
                        )}
                      </div>
                      
                      {/* 操作区 */}
                      <div className="md:col-span-2 flex flex-col justify-between">
                        <div className="flex items-center gap-2 mb-4">
                          {item.proofStatus ? (
                            <div className="flex items-center gap-2 text-green-500">
                              <CheckCircle2Icon />
                              <span className="text-sm">Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-yellow-500">
                              <AlertCircleIcon />
                              <span className="text-sm">Pending</span>
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedItem(item);
                            setIsAlertModalOpen(true);
                          }}
                          className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:neon-glow transition-all flex items-center justify-center gap-2"
                        >
                          <AlertCircleIcon />
                          Set Alert
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 预警配置器按钮 */}
            <div className="fixed bottom-6 right-6">
              <button 
                onClick={() => setIsAlertModalOpen(true)}
                className="glass p-4 rounded-full hover:neon-glow transition-all shadow-lg"
                title="Add New Alert"
              >
                <PlusIcon />
              </button>
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

      {/* 预警配置模态框 */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsAlertModalOpen(false)}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Set Price Alert</h2>
              <button onClick={() => setIsAlertModalOpen(false)} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <select 
                  value={selectedItem?.id || ''}
                  onChange={(e) => {
                    const item = items.find(i => i.id === parseInt(e.target.value));
                    setSelectedItem(item);
                  }}
                  className="w-full bg-secondary border border-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a product</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>{item.name} (¥{item.web3Price})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Price Threshold</label>
                <input 
                  type="number" 
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  placeholder="Enter price threshold"
                  className="w-full bg-secondary border border-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Agent ID</label>
                <input 
                  type="text" 
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  placeholder="Enter agent ID"
                  className="w-full bg-secondary border border-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <button 
                onClick={handleSetAlert}
                disabled={!selectedItem || !alertPrice || !agentId}
                className={`w-full py-3 ${selectedItem && alertPrice && agentId ? 'bg-primary text-primary-foreground hover:neon-glow transition-all' : 'bg-muted text-muted-foreground'} rounded-md`}
              >
                Set Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
