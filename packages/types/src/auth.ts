/**
 * Web3 钱包登录认证类型
 *
 * 🔑 核心概念：Sign-In with Ethereum (SIWE)
 * 传统登录用"用户名+密码"，Web3 登录用"钱包地址+签名"
 * 签名由用户的私钥产生，服务端通过数学恢复出地址来验证身份
 */

// 第一步：前端请求 nonce（随机挑战码）
export interface NonceRequest {
  address: string; // 用户钱包地址，如 0x1234...abcd
}

export interface NonceResponse {
  nonce: string; // 服务端生成的一次性随机字符串
}

// 第二步：前端签名后提交验证
export interface VerifyRequest {
  address: string;   // 声称的钱包地址
  signature: string; // 钱包对 message 的签名
  nonce: string;     // 之前获取的 nonce
}

// 第三步：验证通过，返回 JWT
export interface AuthResponse {
  accessToken: string; // JWT token，后续请求放在 Authorization header
  user: {
    address: string;
    name?: string;
  };
}

// JWT 载荷结构
export interface JwtPayload {
  sub: string;     // subject = 钱包地址（JWT 标准字段）
  address: string; // 冗余存储，方便使用
  iat?: number;    // issued at（签发时间）
  exp?: number;    // expiration（过期时间）
}
