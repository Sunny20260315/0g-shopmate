export class PreferenceEntity {
  id: number;
  userAddress: string;
  type: string;      // Size, Brand, Color, Price Range...
  value: string;     // M, Nike, Black, 100-500...
  category: string;  // Fashion, Electronics...
  hash: string;      // 0G storage proof hash
  created: string;   // ISO date string
  monetized: boolean;
  earnings: number;
}
