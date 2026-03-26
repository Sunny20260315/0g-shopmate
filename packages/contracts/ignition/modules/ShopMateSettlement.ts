import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ShopMateSettlementModule", (m) => {
  const settlement = m.contract("ShopMateSettlement");
  return { settlement };
});
