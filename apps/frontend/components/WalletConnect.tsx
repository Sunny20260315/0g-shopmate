'use client';

/**
 * 钱包连接 + 登录组件
 *
 * 🔑 交互设计：一键连接 + 自动签名
 *   用户点 "Connect Wallet" → MetaMask 弹窗授权连接 → 自动弹出签名请求 → 完成登录
 *   如果用户拒绝签名，停留在"已连接未登录"状态，可手动点 Sign In 重试
 */

import React, { useState, useEffect, useRef } from 'react';
import { walletService } from '@/app/lib/wallet';
import { authService } from '@/app/lib/auth';

const WalletConnect = React.memo(() => {
  const [mounted, setMounted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addressRef = useRef<string | null>(null);

  // 签名登录（独立函数，供 handleConnect 和手动重试共用）
  const signIn = async (addr: string) => {
    await authService.login(
      addr,
      (msg) => walletService.signMessage(msg),
    );
  };

  useEffect(() => {
    const currentState = walletService.getState();
    const isAuthed = authService.isAuthenticated();
    setIsConnected(currentState.isConnected);
    setAddress(currentState.address);
    setIsAuthenticated(isAuthed);
    addressRef.current = currentState.address;
    setMounted(true);

    // 已连接但未登录（刷新页面后 JWT 过期）→ 自动触发签名登录
    if (currentState.isConnected && currentState.address && !isAuthed) {
      signIn(currentState.address).catch(() => {
        // 签名失败（后端未启动等）静默处理，用户可手动点 Sign In
      });
    }

    const unsubWallet = walletService.onStateChange((state) => {
      const prevAddress = addressRef.current;
      setIsConnected(state.isConnected);
      setAddress(state.address);
      addressRef.current = state.address;

      if (!state.isConnected || (state.address && state.address !== prevAddress)) {
        authService.logout();
      }
    });

    const unsubAuth = authService.onAuthChange((authed) => {
      setIsAuthenticated(authed);
    });

    return () => {
      unsubWallet();
      unsubAuth();
    };
  }, []);

  // 一键连接 + 自动签名登录
  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Step 1: 连接钱包
      const state = await walletService.connect();
      if (!state?.address) throw new Error('Failed to get wallet address');

      // Step 2: 自动触发签名登录（MetaMask 会弹第二个窗口）
      await signIn(state.address);
    } catch (err: any) {
      // 用户拒绝签名时不算致命错误，停留在"已连接"状态即可
      if (err.message?.includes('user rejected') || err.message?.includes('denied')) {
        setError('Signature rejected. Click Sign In to retry.');
      } else {
        setError(err.message || 'Connection failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 手动重试签名（用户之前拒绝签名后的 fallback）
  const handleSignIn = async () => {
    if (!address) return;
    try {
      setIsLoading(true);
      setError(null);
      await signIn(address);
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      authService.logout();
      await walletService.disconnect();
    } catch (err: any) {
      console.error('Error disconnecting:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // SSR 占位
  if (!mounted) {
    return <div className="w-[150px] h-[40px]" />;
  }

  // 已连接 + 已登录
  if (isConnected && isAuthenticated && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-mono">{truncateAddress(address)}</span>
        <button
          onClick={handleDisconnect}
          disabled={isLoading}
          className="px-3 py-1 bg-secondary rounded-md text-sm hover:bg-muted transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // 已连接但未登录（用户拒绝了签名，或后端未启动）
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-mono">{truncateAddress(address)}</span>
        {/* <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:neon-glow transition-all"
        >
          {isLoading ? 'Signing...' : 'Sign In'}
        </button> */}
        <button
          onClick={handleDisconnect}
          disabled={isLoading}
          className="px-3 py-1 bg-secondary rounded-md text-sm hover:bg-muted transition-colors"
        >
          Disconnect
        </button>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  }

  // 未连接
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:neon-glow transition-all flex items-center gap-2"
      >
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
});

WalletConnect.displayName = 'WalletConnect';

export default WalletConnect;
