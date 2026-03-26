/**
 * 0G Storage 高级封装层
 * 提供文件上传、下载、验证的完整功能
 */

import { ZgFile, Indexer } from '@0gfoundation/0g-ts-sdk';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

export interface UploadResult {
  rootHash: string;
  txHash: string;
  fileSize: number;
  uploadedAt: Date;
  merkleRoot: string;
}

export interface FileMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  rootHash: string;
  txHash: string;
  merkleRoot: string;
  uploadedAt: Date;
  ipfsHash?: string;
}

export interface StorageConfig {
  rpcUrl: string;
  indexerUrl: string;
  privateKey: string;
  chainId?: number;
}

/**
 * 0G 存储客户端
 */
export class ZgStorageClient {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private indexer: Indexer;
  private config: StorageConfig;

  constructor(config: StorageConfig) {
    this.config = config;
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    this.signer = new ethers.Wallet(config.privateKey, this.provider);
    this.indexer = new Indexer(config.indexerUrl);
  }

  /**
   * 上传文件到 0G 网络
   * @param filePath 文件路径
   * @param metadata 文件元数据
   * @returns 上传结果
   */
  async uploadFile(filePath: string, metadata?: Partial<FileMetadata>): Promise<UploadResult> {
    try {
      // 验证文件存在
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const stats = fs.statSync(filePath);
      const fileName = path.basename(filePath);
      const fileSize = stats.size;

      // 创建文件对象
      const file = await ZgFile.fromFilePath(filePath);

      // 生成默克尔树
      const [tree, treeErr] = await file.merkleTree();
      if (treeErr !== null) {
        await file.close();
        throw new Error(`Merkle tree generation failed: ${treeErr}`);
      }

      const merkleRoot = tree?.rootHash();
      if (!merkleRoot) {
        await file.close();
        throw new Error('Failed to generate merkle root');
      }

      // 上传到 0G 网络
      const [tx, uploadErr] = await this.indexer.upload(file, this.config.rpcUrl, this.signer);

      if (uploadErr !== null) {
        await file.close();
        throw new Error(`Upload failed: ${uploadErr}`);
      }

      if (!tx) {
        await file.close();
        throw new Error('Upload transaction failed');
      }

      // 关闭文件
      await file.close();

      return {
        rootHash: merkleRoot,
        txHash: tx,
        fileSize,
        uploadedAt: new Date(),
        merkleRoot,
      };
    } catch (error) {
      throw new Error(`Upload error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 上传二进制数据
   * @param buffer 数据缓冲区
   * @param fileName 文件名
   * @returns 上传结果
   */
  async uploadBuffer(buffer: Buffer, fileName: string): Promise<UploadResult> {
    const tempFilePath = path.join('/tmp', `zg_${Date.now()}_${fileName}`);

    try {
      // 写入临时文件
      fs.writeFileSync(tempFilePath, buffer);

      // 上传文件
      const result = await this.uploadFile(tempFilePath);

      return result;
    } finally {
      // 清理临时文件
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  }

  /**
   * 上传文本数据
   * @param content 文本内容
   * @param fileName 文件名
   * @returns 上传结果
   */
  async uploadText(content: string, fileName: string): Promise<UploadResult> {
    const buffer = Buffer.from(content, 'utf-8');
    return this.uploadBuffer(buffer, fileName);
  }

  /**
   * 上传 JSON 数据
   * @param data JSON 对象
   * @param fileName 文件名
   * @returns 上传结果
   */
  async uploadJSON(data: unknown, fileName: string): Promise<UploadResult> {
    const content = JSON.stringify(data, null, 2);
    return this.uploadText(content, fileName);
  }

  /**
   * 获取钱包地址
   */
  getAddress(): string {
    return this.signer.address;
  }

  /**
   * 获取钱包余额
   */
  async getBalance(): Promise<string> {
    const balance = await this.provider.getBalance(this.signer.address);
    return ethers.formatEther(balance);
  }

  /**
   * 验证交易状态
   * @param txHash 交易哈希
   */
  async getTransactionStatus(
    txHash: string
  ): Promise<{ status: 'pending' | 'success' | 'failed'; confirmations?: number }> {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);

      if (!receipt) {
        return { status: 'pending' };
      }

      if (receipt.status === 1) {
        return { status: 'success', confirmations: receipt.confirmations };
      }

      return { status: 'failed' };
    } catch {
      return { status: 'pending' };
    }
  }
}

/**
 * 创建 0G 存储客户端
 */
export function createZgStorageClient(config: StorageConfig): ZgStorageClient {
  return new ZgStorageClient(config);
}

/**
 * 从环境变量创建客户端
 */
export function createZgStorageClientFromEnv(): ZgStorageClient {
  const config: StorageConfig = {
    rpcUrl: process.env.NEXT_PUBLIC_0G_CHAIN_RPC || process.env.ZG_RPC_URL || '',
    indexerUrl: process.env.NEXT_PUBLIC_0G_STORAGE_RPC || process.env.ZG_INDEXER_URL || '',
    privateKey: process.env.PRIVATE_KEY || process.env.ZG_PRIVATE_KEY || '',
  };

  if (!config.rpcUrl || !config.indexerUrl || !config.privateKey) {
    throw new Error(
      'Missing required environment variables: RPC URL, Indexer URL, and Private Key'
    );
  }

  return new ZgStorageClient(config);
}

export default {
  uploadFile,
  ZgStorageClient,
  createZgStorageClient,
  createZgStorageClientFromEnv,
};

/**
 * 便捷函数：使用默认客户端上传文件
 */
export async function uploadFile(filePath: string): Promise<UploadResult> {
  const client = createZgStorageClientFromEnv();
  return client.uploadFile(filePath);
}
