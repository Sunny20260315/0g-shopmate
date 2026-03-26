'use client';

import React, { useState, useRef, useEffect } from 'react';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';

// 生成模拟哈希
const generateHash = () => {
  return '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
};

// 模拟商品数据
const mockProducts = [
  {
    id: 1,
    name: '黑色连帽卫衣',
    price: 299,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20hoodie%20with%20minimal%20design&image_size=square',
    hash: generateHash(),
    reason: '基于您的浏览历史，这款卫衣的设计风格符合您的偏好',
  },
  {
    id: 2,
    name: '白色运动鞋',
    price: 499,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20sneakers%20modern%20design&image_size=square',
    hash: generateHash(),
    reason: '这款运动鞋在多个平台上评价良好，价格合理',
  },
  {
    id: 3,
    name: '蓝色牛仔裤',
    price: 399,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20jeans%20classic%20fit&image_size=square',
    hash: generateHash(),
    reason: '经典款式，适合多种场合穿着',
  },
];

// ReAct 步进器状态
const reactSteps = [
  'Thinking...',
  'Searching Amazon...',
  'Comparing Prices...',
  'Verifying on 0G...',
  'Completed ✔',
];

// 内联 SVG 图标
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
    <path d="M2 17l10 5 10-5"></path>
    <path d="M2 12l10 5 10-5"></path>
  </svg>
);

const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const CheckCircle2Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9 12l2 2 4-4"></path>
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="12" x2="20" y2="12"></line>
    <line x1="4" y1="6" x2="20" y2="6"></line>
    <line x1="4" y1="18" x2="20" y2="18"></line>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

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

export default function Concierge() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isImageMode, setIsImageMode] = useState(false);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentReactStep, setCurrentReactStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 模拟 0G Node 连接状态
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(prev => Math.random() > 0.1); // 90% 概率连接
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 滚动到聊天底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 模拟AI响应
  const handleSend = () => {
    if (!input.trim() && !uploadedImage) return;

    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      image: uploadedImage,
    };
    setMessages([...messages, userMessage]);
    setInput('');
    setUploadedImage(null);

    // 模拟AI思考过程
    setIsTyping(true);
    setCurrentReactStep(0);

    // 模拟ReAct步进
    const stepInterval = setInterval(() => {
      setCurrentReactStep(prev => {
        if (prev < reactSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          // 完成后生成AI回复
          setTimeout(() => {
            const aiMessage = {
              id: Date.now() + 1,
              type: 'ai',
              content: '根据您的需求，我为您推荐了以下商品。这些商品已经通过0G存储验证，确保真实性和数据主权。',
              products: mockProducts,
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
          }, 1000);
          return prev;
        }
      });
    }, 1000);
  };

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsImageUploading(true);
      // 模拟图片识别
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUploadedImage(event.target?.result as string);
          setIsImageUploading(false);
          // 生成图片描述
          setInput('黑色连帽卫衣 M 码');
        };
        reader.readAsDataURL(file);
      }, 2000);
    }
  };

  // 处理商品验证
  const handleVerifyProduct = (product: any) => {
    setSelectedProduct(product);
    setIsEvidenceDrawerOpen(true);
  };

  // 清空对话
  const handleClearChat = () => {
    setMessages([]);
  };

  // 模拟钱包地址
  const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const truncatedAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 顶部导航栏 */}
      <TopNav currentPage="Concierge" />

      {/* 主要内容区 */}
      <main className="flex-1 flex">
        {/* 侧边栏 */}
        <Sidebar currentPage="Concierge" />

        {/* 中央聊天区 */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* 空状态 */}
              {messages.length === 0 && !isTyping && (
                <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                  <div className="w-16 h-16 mb-4 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"></path>
                      <polyline points="16 17 12 13 8 17"></polyline>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">请输入购物需求</h2>
                  <p className="text-muted-foreground">
                    文字/图片，AI 将为你推荐最佳选择
                  </p>
                </div>
              )}

              {/* 消息列表 */}
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-lg ${message.type === 'user' ? 'bg-secondary' : 'bg-accent'}`}>
                    {message.content && <p>{message.content}</p>}
                    {message.image && <img src={message.image} alt="Uploaded" className="mt-2 rounded-md max-h-40" />}
                    
                    {/* AI 消息中的商品列表 */}
                    {message.type === 'ai' && message.products && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {message.products.map((product: any) => (
                          <div key={product.id} className="glass p-4 rounded-lg hover:neon-glow transition-all">
                            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-2" />
                            <h3 className="font-semibold mb-1">{product.name}</h3>
                            <p className="text-lg font-bold mb-2">¥{product.price}</p>
                            <p className="text-sm text-muted-foreground mb-3">{product.reason}</p>
                            <button
                              onClick={() => handleVerifyProduct(product)}
                              className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:neon-glow transition-all flex items-center justify-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9 12l2 2 4-4"></path>
                              </svg>
                              Verify on 0G
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* AI 思考中 */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-4 rounded-lg bg-accent">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
                    </div>
                    <div className="mt-4 glass p-4 rounded-lg">
                      <h4 className="font-medium mb-2 text-primary">Thinking Process</h4>
                      <div className="space-y-2">
                        {reactSteps.map((step, index) => (
                          <div key={index} className={`flex items-center gap-2 ${index <= currentReactStep ? 'text-primary' : 'text-muted-foreground'}`}>
                            <div className={`w-2 h-2 rounded-full ${index === currentReactStep ? 'bg-primary animate-pulse' : index < currentReactStep ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>

          {/* 底部输入区 */}
          <footer className="sticky bottom-0 z-10 glass border-t border-border p-4">
            <div className="max-w-4xl mx-auto flex items-center gap-2">
              {/* 语音输入按钮 */}
              <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                <MicIcon />
              </button>
              
              {/* 输入区域 */}
              <div className="flex-1 relative">
                {isImageMode ? (
                  <div className="border border-border rounded-full p-4 text-center hover:bg-secondary transition-colors cursor-pointer">
                    {isImageUploading ? (
                      <p className="text-muted-foreground">识别中...</p>
                    ) : uploadedImage ? (
                      <div className="relative inline-block">
                        <img src={uploadedImage} alt="Uploaded" className="w-32 h-32 object-cover rounded-md" />
                        <button
                          onClick={() => setUploadedImage(null)}
                          className="absolute top-1 right-1 p-1 bg-background rounded-full"
                        >
                          <XIcon />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon />
                        <p className="text-sm text-muted-foreground">拖拽图片或点击上传</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="mt-2 inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:neon-glow transition-all cursor-pointer">
                          选择图片
                        </label>
                      </>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="输入购物需求..."
                    className="w-full bg-secondary border border-border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
              </div>
              
              {/* 多模态输入切换 */}
              <button
                onClick={() => setIsImageMode(!isImageMode)}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                {isImageMode ? <SendIcon /> : <ImageIcon />}
              </button>
              
              {/* 发送按钮 */}
              <button
                onClick={handleSend}
                disabled={!input.trim() && !uploadedImage}
                className={`p-2 rounded-full ${(input.trim() || uploadedImage) ? 'bg-primary text-primary-foreground hover:neon-glow transition-all' : 'bg-muted text-muted-foreground'}`}
              >
                <SendIcon />
              </button>
            </div>
          </footer>
        </div>

        {/* 证据抽屉触发器 */}
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
          <button
            onClick={() => setIsEvidenceDrawerOpen(!isEvidenceDrawerOpen)}
            className="glass p-3 rounded-full hover:neon-glow transition-all"
            title="Evidence Drawer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9 12l2 2 4-4"></path>
            </svg>
          </button>
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

      {/* Evidence Drawer */}
      {isEvidenceDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsEvidenceDrawerOpen(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md glass p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">0G 验证证据</h2>
              <button onClick={() => setIsEvidenceDrawerOpen(false)} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <XIcon />
              </button>
            </div>
            
            {selectedProduct ? (
              <div className="space-y-6">
                <div>
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-40 object-cover rounded-md" />
                  <h3 className="font-semibold mt-2">{selectedProduct.name}</h3>
                  <p className="text-lg font-bold">¥{selectedProduct.price}</p>
                </div>
                
                <div className="glass p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-primary">商品 0G 存储哈希</h4>
                  <p className="font-mono text-sm bg-secondary p-2 rounded break-all">
                    {selectedProduct.hash}
                  </p>
                </div>
                
                <div className="glass p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-primary">DataRoot</h4>
                  <p className="font-mono text-sm bg-secondary p-2 rounded break-all">
                    {generateHash()}
                  </p>
                </div>
                
                <div className="glass p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-primary">时间戳</h4>
                  <p className="font-mono text-sm">{new Date().toISOString()}</p>
                </div>
                
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle2Icon />
                  <span>已加密存证</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9 12l2 2 4-4"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Evidence Selected</h3>
                <p className="text-muted-foreground">
                  Click "Verify on 0G" on a product to view its verification evidence
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
