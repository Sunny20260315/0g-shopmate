// 通用工具函数
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const isValidEthAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const truncateString = (str: string, length: number) => {
  return str.length > length ? str.slice(0, length) + "..." : str;
};

export const parseJSON = (data: string | null) => {
  try {
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
};
