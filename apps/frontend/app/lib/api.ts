/**
 * 前端 API 封装层
 *
 * 🔑 核心知识点：
 * 所有 API 调用通过 authService.authFetch() 自动带上 JWT token。
 * 如果 token 过期或无效，后端返回 401，前端可以提示用户重新连接钱包。
 */
import { authService } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:3001/api';
const API_V1 = `${API_BASE}/v1`;

// ========== Chat API ==========

export interface ChatProduct {
  name: string;
  price: number;
  market: 'web2' | 'web3';
  confidence: number;
  reason: string;
}

export interface ChatResponse {
  text: string;
  products: ChatProduct[];
  proof: { dataRoot: string; txHash: string } | null;
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const res = await authService.authFetch(`${API_V1}/chat/send`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Chat failed (${res.status})`);
  }
  return res.json();
}

export async function clearChatHistory(): Promise<void> {
  await authService.authFetch(`${API_V1}/chat/history`, { method: 'DELETE' });
}

// ========== Preference API ==========

export interface PreferenceItem {
  id: number;
  type: string;
  value: string;
  category: string;
  hash: string;
  created: string;
  monetized: boolean;
  earnings: number;
}

export async function getPreferences(): Promise<PreferenceItem[]> {
  const res = await authService.authFetch(`${API_V1}/preferences`);
  if (!res.ok) throw new Error(`Failed to load preferences (${res.status})`);
  return res.json();
}

export async function createPreference(data: {
  type: string;
  value: string;
  category: string;
}): Promise<PreferenceItem> {
  const res = await authService.authFetch(`${API_V1}/preferences`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create preference');
  return res.json();
}

export async function updatePreference(
  id: number,
  data: { monetized?: boolean; value?: string },
): Promise<PreferenceItem> {
  const res = await authService.authFetch(`${API_V1}/preferences/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update preference');
  return res.json();
}

export async function deletePreference(id: number): Promise<void> {
  const res = await authService.authFetch(`${API_V1}/preferences/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete preference');
}
