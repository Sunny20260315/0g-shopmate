/**
 * 智能合约交互服务
 *
 * 🔑 核心知识点：
 *
 * 1. 读操作 vs 写操作
 *    读操作（查余额）用公共 RPC Provider，不需要钱包签名，不花 Gas
 *    写操作（转账）需要钱包 Signer，会弹 MetaMask 确认，花 Gas
 *
 * 2. Human-Readable ABI
 *    ethers.js 支持用字符串描述函数签名，不需要完整 JSON ABI
 *    比如 'function payToAgent(address) payable' 就够了
 *
 * 3. 合约事件（Events）
 *    合约执行后发出 Event，可以用 queryFilter 查询历史事件
 *    这就是链上的"交易记录"
 */
import { ethers } from 'ethers';
import { walletService } from './wallet';

// 最小化 ABI — 只包含我们需要调用的函数和事件
const SETTLEMENT_ABI = [
  'function agentBalances(address) view returns (uint256)',
  'function payToAgent(address agentId) payable',
  'function authorizeAgent(address agentId)',
  'function userAuthorizedAgent(address) view returns (address)',
  'function DATA_CONTRIBUTOR_RATIO() view returns (uint256)',
  'function AGENT_OPERATOR_RATIO() view returns (uint256)',
  'event PaymentReceived(address indexed payer, uint256 amount)',
  'event CommissionDistributed(address indexed contributor, address indexed operator, uint256 contributorAmount, uint256 operatorAmount)',
];

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SETTLEMENT_CONTRACT || '';
const RPC_URL = process.env.NEXT_PUBLIC_0G_CHAIN_RPC || 'https://evmrpc-testnet.0g.ai';

class SettlementService {
  /**
   * 只读合约实例（用公共 RPC，不需要钱包）
   */
  private getReadContract(): ethers.Contract {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    return new ethers.Contract(CONTRACT_ADDRESS, SETTLEMENT_ABI, provider);
  }

  /**
   * 可写合约实例（用钱包 Signer，操作需要 Gas）
   */
  private getWriteContract(): ethers.Contract {
    const { signer } = walletService.getState();
    if (!signer) throw new Error('Wallet not connected');
    return new ethers.Contract(CONTRACT_ADDRESS, SETTLEMENT_ABI, signer);
  }

  /**
   * 查询某个 Agent 的累计余额
   */
  async getAgentBalance(agentAddress: string): Promise<string> {
    if (!CONTRACT_ADDRESS) return '0';
    const contract = this.getReadContract();
    const balance = await contract.agentBalances(agentAddress);
    return ethers.formatEther(balance);
  }

  /**
   * 向 Agent 支付（会弹 MetaMask 确认）
   */
  async payToAgent(agentAddress: string, amountInEther: string): Promise<ethers.TransactionResponse> {
    const contract = this.getWriteContract();
    const tx = await contract.payToAgent(agentAddress, {
      value: ethers.parseEther(amountInEther),
    });
    return tx;
  }

  /**
   * 授权某个 Agent
   */
  async authorizeAgent(agentAddress: string): Promise<ethers.TransactionResponse> {
    const contract = this.getWriteContract();
    return contract.authorizeAgent(agentAddress);
  }

  /**
   * 查询链上 PaymentReceived 事件（交易历史）
   */
  async getPaymentEvents(): Promise<Array<{
    payer: string;
    amount: string;
    txHash: string;
    blockNumber: number;
  }>> {
    if (!CONTRACT_ADDRESS) return [];
    try {
      const contract = this.getReadContract();
      const filter = contract.filters.PaymentReceived();
      const events = await contract.queryFilter(filter, -10000); // 最近 10000 个区块
      return events.map((e: any) => ({
        payer: e.args[0],
        amount: ethers.formatEther(e.args[1]),
        txHash: e.transactionHash,
        blockNumber: e.blockNumber,
      }));
    } catch {
      return [];
    }
  }

  isConfigured(): boolean {
    return !!CONTRACT_ADDRESS;
  }
}

export const settlementService = new SettlementService();
