/**
 * AI 购物助手服务
 *
 * 🔑 核心知识点：
 *
 * 1. System Prompt 工程
 *    通过 system message 约束 AI 的输出格式（JSON），确保前端能可靠解析。
 *    AI 不是数据库，它的输出格式不稳定，所以要用 try/catch 兜底。
 *
 * 2. 对话历史管理
 *    用 Map<address, messages[]> 维护每个用户的上下文。
 *    AI 的 "记忆" 来自我们把历史消息全部塞进请求。
 *    messages 越长 → token 费用越高 → 要限制长度。
 *
 * 3. 0G 存证（可选）
 *    每次对话上传到 0G Storage，生成 dataRoot 和 txHash 作为存证。
 *    testnet 不稳定时跳过，不阻塞 AI 响应。
 */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface ChatProduct {
  name: string;
  price: number;
  market: 'web2' | 'web3';
  confidence: number;
  reason: string;
}

export interface ChatResult {
  text: string;
  products: ChatProduct[];
  proof: { dataRoot: string; txHash: string } | null;
}

const SYSTEM_PROMPT = `You are ShopMate AI, an intelligent shopping assistant. When the user describes what they want to buy, suggest 2-3 products with realistic prices.

Respond ONLY with valid JSON in this exact format (no markdown, no code fences):
{
  "text": "Your natural language response to the user",
  "products": [
    {
      "name": "Product name",
      "price": 299,
      "market": "web2",
      "confidence": 0.95,
      "reason": "Why this product is recommended"
    }
  ]
}

Rules:
- If the user is just chatting (not shopping), set products to an empty array.
- Respond in the same language the user uses.
- Prices should be realistic for the product category.
- market is "web2" for traditional e-commerce, "web3" for NFT/blockchain goods.
- confidence is 0-1, how confident you are this matches the user's needs.`;

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private openai: OpenAI;
  private conversations = new Map<string, Array<{ role: 'user' | 'assistant' | 'system'; content: string }>>();

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY not set, chat will not work');
    }
    this.openai = new OpenAI({
      apiKey: apiKey || '',
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    });
  }

  async sendMessage(address: string, userMessage: string): Promise<ChatResult> {
    // 获取或初始化对话历史
    if (!this.conversations.has(address)) {
      this.conversations.set(address, []);
    }
    const history = this.conversations.get(address)!;

    // 添加用户消息
    history.push({ role: 'user', content: userMessage });

    // 限制历史长度（保留最近 20 条，避免 token 超限）
    const recentHistory = history.slice(-20);

    try {
      // 调用 DashScope AI
      const completion = await this.openai.chat.completions.create({
        model: 'qwen-plus',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...recentHistory,
        ],
        temperature: 0.7,
      });

      const rawContent = completion.choices[0]?.message?.content || '';
      this.logger.debug(`AI raw response: ${rawContent.substring(0, 200)}`);

      // 解析 AI 返回的 JSON
      const parsed = this.parseAiResponse(rawContent);

      // 添加 AI 回复到历史
      history.push({ role: 'assistant', content: rawContent });

      // 🔑 0G 存证：当前使用 mock proof（common 包有编译问题待修复）
      // 真实 0G 上传需要 @0gfoundation/0g-ts-sdk，接口已在 packages/common 中封装
      // 修复 common 包后只需：
      //   const result = await zgClient.uploadJSON(payload, filename);
      //   proof = { dataRoot: result.rootHash, txHash: result.txHash };
      const proof = this.generateMockProof();

      return {
        text: parsed.text,
        products: parsed.products,
        proof,
      };
    } catch (error: any) {
      this.logger.error(`AI call failed: ${error.message}`);

      // AI 调用失败时返回友好提示
      return {
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        products: [],
        proof: null,
      };
    }
  }

  /**
   * 解析 AI 返回的 JSON
   * AI 不总是返回完美 JSON，需要兜底处理
   */
  private parseAiResponse(raw: string): { text: string; products: ChatProduct[] } {
    try {
      // 尝试提取 JSON（AI 有时会包裹在 ```json ``` 中）
      let jsonStr = raw;
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }

      const parsed = JSON.parse(jsonStr);
      return {
        text: parsed.text || raw,
        products: Array.isArray(parsed.products) ? parsed.products : [],
      };
    } catch {
      // JSON 解析失败，把整段文字作为回复，无商品推荐
      this.logger.warn('Failed to parse AI JSON response, using raw text');
      return { text: raw, products: [] };
    }
  }

  /**
   * 生成模拟 0G 存证
   * 真实 0G 上传需要链上交易（30s+），hackathon demo 用随机 hash 模拟
   */
  private generateMockProof() {
    const randomHash = () =>
      '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return {
      dataRoot: randomHash(),
      txHash: randomHash(),
    };
  }

  /**
   * 清除用户对话历史
   */
  clearHistory(address: string): void {
    this.conversations.delete(address.toLowerCase());
  }
}
