/**
 * 0G 存储集成测试
 * 用于验证存储功能是否正确工作
 */

import { createZgStorageClientFromEnv, ZgStorageClient } from '@shopmate/common';

/**
 * 测试套件
 */
async function runTests() {
  console.log('🧪 开始 0G 存储集成测试...\n');

  try {
    // 测试 1: 验证环境变量
    console.log('✅ 测试 1: 验证环境变量...');
    await testEnvironmentVariables();
    console.log('   ✓ 环境变量配置正确\n');

    // 测试 2: 创建客户端
    console.log('✅ 测试 2: 创建客户端...');
    const client = await testClientCreation();
    console.log('   ✓ 客户端创建成功\n');

    // 测试 3: 获取钱包信息
    console.log('✅ 测试 3: 获取钱包信息...');
    await testWalletInfo(client);
    console.log('   ✓ 钱包信息获取成功\n');

    // 测试 4: 上传文本
    console.log('✅ 测试 4: 上传文本数据...');
    const textResult = await testTextUpload(client);
    console.log('   ✓ 文本上传成功\n');

    // 测试 5: 上传 JSON
    console.log('✅ 测试 5: 上传 JSON 数据...');
    const jsonResult = await testJsonUpload(client);
    console.log('   ✓ JSON 上传成功\n');

    // 测试 6: 验证交易
    console.log('✅ 测试 6: 验证交易状态...');
    await testTransactionVerification(client, textResult.txHash);
    console.log('   ✓ 交易验证成功\n');

    console.log('✅ 所有测试通过！\n');
    console.log('📊 测试摘要:');
    console.log(`   - 钱包地址: ${client.getAddress()}`);
    console.log(`   - 文本上传: ${textResult.rootHash}`);
    console.log(`   - JSON 上传: ${jsonResult.rootHash}`);
    console.log('\n📚 更多信息请参考: docs/0G_STORAGE_INTEGRATION.md\n');
  } catch (error) {
    console.error('❌ 测试失败:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

/**
 * 测试环境变量
 */
async function testEnvironmentVariables() {
  const required = ['NEXT_PUBLIC_0G_CHAIN_RPC', 'NEXT_PUBLIC_0G_STORAGE_RPC', 'PRIVATE_KEY'];

  const missing = required.filter(
    (env) => !process.env[env] && !process.env[`ZG_${env.replace(/^NEXT_PUBLIC_/, '')}`]
  );

  if (missing.length > 0) {
    throw new Error(`缺少环境变量: ${missing.join(', ')}`);
  }
}

/**
 * 测试客户端创建
 */
async function testClientCreation(): Promise<ZgStorageClient> {
  const client = createZgStorageClientFromEnv();
  if (!client) {
    throw new Error('客户端创建失败');
  }
  return client;
}

/**
 * 测试钱包信息
 */
async function testWalletInfo(client: ZgStorageClient) {
  const address = client.getAddress();
  const balance = await client.getBalance();

  if (!address) {
    throw new Error('无法获取钱包地址');
  }

  console.log(`      地址: ${address}`);
  console.log(`      余额: ${balance} ZG`);

  if (parseFloat(balance) === 0) {
    console.warn('      ⚠️  警告: 钱包余额为 0，可能无法上传文件');
  }
}

/**
 * 测试文本上传
 */
async function testTextUpload(
  client: ZgStorageClient
): Promise<{ rootHash: string; txHash: string }> {
  const testContent = `测试内容 - ${new Date().toISOString()}`;
  const result = await client.uploadText(testContent, 'test_text.txt');

  console.log(`      根哈希: ${result.rootHash}`);
  console.log(`      交易哈希: ${result.txHash}`);
  console.log(`      文件大小: ${result.fileSize} 字节`);

  return result;
}

/**
 * 测试 JSON 上传
 */
async function testJsonUpload(
  client: ZgStorageClient
): Promise<{ rootHash: string; txHash: string }> {
  const testData = {
    timestamp: new Date().toISOString(),
    testMessage: '这是一条测试消息',
    version: '1.0',
  };

  const result = await client.uploadJSON(testData, 'test_data.json');

  console.log(`      根哈希: ${result.rootHash}`);
  console.log(`      交易哈希: ${result.txHash}`);
  console.log(`      文件大小: ${result.fileSize} 字节`);

  return result;
}

/**
 * 测试交易验证
 */
async function testTransactionVerification(client: ZgStorageClient, txHash: string) {
  const status = await client.getTransactionStatus(txHash);

  console.log(`      状态: ${status.status}`);
  if (status.confirmations !== undefined) {
    console.log(`      确认数: ${status.confirmations}`);
  }
}

// 运行测试
if (require.main === module) {
  runTests().catch(console.error);
}

export { testClientCreation, testWalletInfo, testTextUpload, testJsonUpload };
