// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// 0G-ShopMate 自动化结算合约（微支付+分润）
contract ShopMateSettlement is Ownable, ReentrancyGuard {
    // Agent ID => 余额
    mapping(address => uint256) public agentBalances;
    // 用户 => 已授权的 Agent ID
    mapping(address => address) public userAuthorizedAgent;

    // 分润比例（千分比）：数据贡献者 30%，Agent 运营者 70%
    uint256 public constant DATA_CONTRIBUTOR_RATIO = 300;
    uint256 public constant AGENT_OPERATOR_RATIO = 700;

    event PaymentReceived(address indexed payer, uint256 amount);
    event CommissionDistributed(address indexed contributor, address indexed operator, uint256 contributorAmount, uint256 operatorAmount);

    constructor() Ownable(msg.sender) {}

    // 用户向 Agent 支付
    function payToAgent(address agentId) external payable nonReentrant {
        require(msg.value > 0, "Amount must be > 0");
        agentBalances[agentId] += msg.value;
        emit PaymentReceived(msg.sender, msg.value);
    }

    // 自动化分润
    function distributeCommission(address contributor, address operator) external onlyOwner nonReentrant {
        uint256 total = agentBalances[msg.sender];
        require(total > 0, "No balance to distribute");
        
        uint256 contributorAmount = (total * DATA_CONTRIBUTOR_RATIO) / 1000;
        uint256 operatorAmount = (total * AGENT_OPERATOR_RATIO) / 1000;

        // 转账给数据贡献者和运营者
        payable(contributor).transfer(contributorAmount);
        payable(operator).transfer(operatorAmount);

        // 清空 Agent 余额
        agentBalances[msg.sender] = 0;

        emit CommissionDistributed(contributor, operator, contributorAmount, operatorAmount);
    }

    // 用户授权 Agent ID
    function authorizeAgent(address agentId) external {
        userAuthorizedAgent[msg.sender] = agentId;
    }
}