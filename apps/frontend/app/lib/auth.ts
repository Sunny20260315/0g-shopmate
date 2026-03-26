/**
 * 前端认证服务
 *
 * 🔑 核心概念：JWT 是 Web3 身份到 Web2 后端的桥梁
 *
 * Web3 世界没有"会话"概念 —— 区块链上每笔交易都是独立签名的。
 * 但我们的后端是传统 HTTP 服务，需要一种方式知道"这个请求来自哪个用户"。
 *
 * 解决方案：用钱包签名证明身份一次，后端签发 JWT token。
 * 后续 API 调用带上这个 token 即可，不需要反复签名。
 *
 * 认证流程：
 * 1. 请求 nonce（服务端生成的一次性挑战码）
 * 2. 用钱包签名 nonce（MetaMask 弹窗，用户确认）
 * 3. 把签名发给后端验证
 * 4. 后端返回 JWT，存到 localStorage
 */

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:3001/api';
const API_V1 = `${API_BASE}/v1`;

export interface AuthUser {
  address: string;
  name?: string;
}

class AuthService {
  private token: string | null = null;
  private user: AuthUser | null = null;
  private listeners: Array<(authenticated: boolean, user: AuthUser | null) => void> = [];
  private STORAGE_KEY = 'shopmate_auth_token';
  private USER_KEY = 'shopmate_auth_user';

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(this.STORAGE_KEY);
      const savedUser = localStorage.getItem(this.USER_KEY);
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser);
        } catch {
          this.user = null;
        }
      }
    }
  }

  /**
   * 完整的钱包登录流程
   *
   * @param address 钱包地址
   * @param signMessage 签名函数（由 walletService 提供）
   *
   * 为什么 signMessage 作为回调传入而不是直接 import walletService？
   * → 解耦：auth 服务不依赖具体的钱包实现，方便测试和替换
   */
  async login(
    address: string,
    signMessage: (msg: string) => Promise<string>,
  ): Promise<AuthUser> {
    // Step 1: 请求 nonce
    const nonceRes = await fetch(`${API_V1}/auth/nonce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });

    if (!nonceRes.ok) {
      const err = await nonceRes.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to get nonce');
    }
    const { nonce } = await nonceRes.json();

    // Step 2: 构建消息并用钱包签名
    // 用户会在 MetaMask 中看到这段文字并确认签名
    const message = `Sign in to 0G-ShopMate\nNonce: ${nonce}`;
    const signature = await signMessage(message);

    // Step 3: 发送签名给后端验证
    const verifyRes = await fetch(`${API_V1}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, signature, nonce }),
    });

    if (!verifyRes.ok) {
      const err = await verifyRes.json().catch(() => ({}));
      throw new Error(err.message || 'Signature verification failed');
    }

    const data = await verifyRes.json();

    // Step 4: 保存 JWT 和用户信息
    this.token = data.accessToken;
    this.user = data.user;
    localStorage.setItem(this.STORAGE_KEY, this.token!);
    localStorage.setItem(this.USER_KEY, JSON.stringify(this.user));
    this.notifyListeners();

    return data.user;
  }

  /**
   * 登出：清除 JWT 和用户信息
   */
  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.notifyListeners();
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): AuthUser | null {
    return this.user;
  }

  /**
   * 🔑 不能只检查 token 是否存在，还要检查是否过期
   * JWT 的 payload 是 base64 编码（非加密），客户端可以直接解码读取 exp 字段
   * 注意：这里不验证签名（那是后端的事），只检查过期时间
   */
  isAuthenticated(): boolean {
    if (!this.token) return false;
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        // token 已过期，清理掉
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 带认证的 fetch 封装
   * 自动在请求头添加 Authorization: Bearer <token>
   */
  async authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    if (!this.token) {
      throw new Error('Not authenticated');
    }
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  onAuthChange(listener: (authenticated: boolean, user: AuthUser | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    const isAuth = this.isAuthenticated();
    this.listeners.forEach((l) => l(isAuth, this.user));
  }
}

export const authService = new AuthService();
