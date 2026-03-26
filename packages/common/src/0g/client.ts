import { ZgFile, Indexer, Batcher, KvClient } from '@0gfoundation/0g-ts-sdk';
import { ethers } from 'ethers';

const RPC_URL = process.env.NEXT_PUBLIC_0G_CHAIN_RPC!;
const INDEXER_RPC = process.env.NEXT_PUBLIC_0G_STORAGE_RPC!;

// Initialize provider and signer
const privateKey = process.env.PRIVATE_KEY!; // Replace with your private key
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(privateKey, provider);

// Initialize indexer
const indexer = new Indexer(INDEXER_RPC as string);

async function uploadFile(filePath: any) {
  // Create file object from file path
  const file = await ZgFile.fromFilePath(filePath);

  // Generate Merkle tree for verification
  const [tree, treeErr] = await file.merkleTree();
  if (treeErr !== null) {
    throw new Error(`Error generating Merkle tree: ${treeErr}`);
  }

  // Get root hash for future reference
  console.log('File Root Hash:', tree?.rootHash());

  // Upload to network
  const [tx, uploadErr] = await indexer.upload(file, RPC_URL, signer);
  if (uploadErr !== null) {
    throw new Error(`Upload error: ${uploadErr}`);
  }

  console.log('Upload successful! Transaction:', tx);

  // Always close the file when done
  await file.close();

  return { rootHash: tree?.rootHash(), txHash: tx };
}

export { uploadFile };
