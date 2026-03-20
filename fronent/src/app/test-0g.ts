import { ZgFile, Indexer, Batcher, KvClient } from "@0gfoundation/0g-ts-sdk";
import { ethers } from "ethers";

async function testConnection() {
  // 1. 初始化钱包
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_0G_RPC);
  const signer = new ethers.Wallet(
    process.env.NEXT_PUBLIC_PRIVATE_KEY!,
    provider,
  );

  const indexer = new Indexer(process.env.NEXT_PUBLIC_0G_STORAGE_RPC);

  // 2. 初始化 0G Client
  const client = new KvClient(provider);

  // 3. 检查余额
  const balance = await signer.getBalance();
  console.log("钱包余额:", ethers.utils.formatEther(balance));

  // 4. 测试上传文件到 0G Storage
  const testData = "Hello 0G Storage!";
  const uploadResult = await client.upload(Buffer.from(testData));
  console.log("上传成功，Root Hash:", uploadResult);
}

testConnection();
