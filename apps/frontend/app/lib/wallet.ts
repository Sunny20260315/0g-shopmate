'use client';

import { ethers } from 'ethers';

// 扩展Window接口以包含ethereum属性
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletState {
  address: string | null;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  isConnected: boolean;
}

class WalletService {
  private state: WalletState = {
    address: null,
    chainId: null,
    provider: null,
    signer: null,
    isConnected: false,
  };

  private listeners: Array<(state: WalletState) => void> = [];
  private STORAGE_KEY = 'shopmate_wallet_state';

  constructor() {
    // 初始化时从localStorage恢复状态
    this.loadState();
  }

  // 连接钱包
  async connect() {
    try {
      // 检查是否在浏览器环境中
      if (typeof window === 'undefined') {
        throw new Error('Not in browser environment');
      }

      // 尝试使用window.ethereum或window.thereum
      const ethereumProvider = window.ethereum;
      if (!ethereumProvider) {
        throw new Error('No Ethereum wallet detected');
      }

      // 连接钱包
      const provider = new ethers.BrowserProvider(ethereumProvider);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      this.state= {
        address,
        chainId: Number(network.chainId),
        provider,
        signer,
        isConnected: true,
      };

      this.saveState();
      this.notifyListeners();
      this.setupEventListeners(ethereumProvider);

      return this.state;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  // 断开钱包
  async disconnect() {
    this.state = {
      address: null,
      chainId: null,
      provider: null,
      signer: null,
      isConnected: false,
    };
    this.clearState();
    this.notifyListeners();
  }

  // 保存状态到localStorage
  private saveState() {
    if (typeof window !== 'undefined') {
      const stateToSave = {
        address: this.state.address,
        chainId: this.state.chainId,
        isConnected: this.state.isConnected,
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }

  // 从localStorage加载状态
  private loadState() {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          this.state = {
            ...this.state,
            address: parsedState.address,
            chainId: parsedState.chainId,
            isConnected: parsedState.isConnected,
          };
          
          // 如果之前已连接，尝试重新连接
          if (parsedState.isConnected) {
            this.reconnect();
          }
        } catch (error) {
          console.error('Error loading wallet state:', error);
          this.clearState();
        }
      }
    }
  }

  // 重新连接钱包
  private reconnect() {
    // 不使用async/await，避免阻塞初始化
    if (typeof window === 'undefined') {
      return;
    }

    const ethereumProvider = window.ethereum;
    if (!ethereumProvider) {
      // 如果没有钱包，重置状态
      this.disconnect();
      return;
    }

    // 异步尝试重新连接，不阻塞初始化
    (async () => {
      try {
        // 尝试重新连接
        const provider = new ethers.BrowserProvider(ethereumProvider);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();

        this.state = {
          address,
          chainId: Number(network.chainId),
          provider,
          signer,
          isConnected: true,
        };

        this.saveState();
        this.notifyListeners();
        this.setupEventListeners(ethereumProvider);
      } catch (error) {
        console.error('Error reconnecting wallet:', error);
        // 重新连接失败，重置状态
        this.disconnect();
      }
    })();
  }

  // 清除localStorage中的状态
  private clearState() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  // 获取当前状态
  getState(): WalletState {
    return this.state;
  }

  // 签名消息
  async signMessage(message: string): Promise<string> {
    if (!this.state.signer) {
      throw new Error('Wallet not connected');
    }
    return await this.state.signer.signMessage(message);
  }

  // 验证签名
  async verifySignature(
    message: string,
    signature: string,
    address: string
  ): Promise<boolean> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress === address;
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

  // 防止 connect + reconnect 重复绑定监听器
  private eventListenersSetup = false;

  // 设置事件监听器
  private setupEventListeners(ethereumProvider: any) {
    if (!ethereumProvider || this.eventListenersSetup) return;
    this.eventListenersSetup = true;

    // 监听账户变化
    ethereumProvider.on('accountsChanged', async (accounts: string[]) => {
      if (accounts.length === 0) {
        await this.disconnect();
      } else {
        const address = accounts[0];
        this.state.address = address;
        this.notifyListeners();
      }
    });

    // 监听网络变化
    ethereumProvider.on('chainChanged', async (chainId: string) => {
      this.state.chainId = parseInt(chainId, 16);
      this.notifyListeners();
    });
  }

  // 添加状态变化监听器
  onStateChange(listener: (state: WalletState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // 通知监听器
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// 导出单例
export const walletService = new WalletService();
export default walletService;