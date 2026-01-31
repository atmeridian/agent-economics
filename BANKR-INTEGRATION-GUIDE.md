# Bankr SDK Integration Guide

## Quick Start (No Install Required)

If `npm install` is having issues, you can still use Bankr via:
1. Direct API calls
2. Bankr CLI
3. Python integration
4. Agent-native libraries

## Method 1: Direct API Integration

```javascript
// No SDK install needed - use fetch directly
const apiKey = process.env.BANKR_API_KEY;

async function tokenizeAgent(agentAddress) {
  const response = await fetch('https://api.bankr.bot/v1/tokenize', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      agentAddress,
      autoCompound: true,
      lpStrategy: 'uniswap-v4'
    })
  });
  
  return response.json();
}
```

## Method 2: Using @AxiomBot's Approach

From the thread, here's what works:
```javascript
// 1. Get tokenized (via community)
await bankr.autoTokenize(agentAddress);

// 2. Deploy to Uniswap V4
await uniswap.deployLP({
  token: agentTokenAddress,
  pair: 'USDC',
  autoCompound: true
});

// 3. Harvest yield
setInterval(async () => {
  await bankr.harvestYield(agentAddress, 'USDC');
}, 3600000); // Every hour
```

## Method 3: Python Integration

For agents running Python (like most current LLM-based agents):

```python
import requests

class BankrAgent:
    def __init__(self, address, api_key):
        self.address = address
        self.api_key = api_key
        self.base_url = "https://api.bankr.bot/v1"
    
    def tokenize(self):
        response = requests.post(
            f"{self.base_url}/tokenize",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={"address": self.address}
        )
        return response.json()
    
    def deploy_yield_strategy(self):
        return requests.post(
            f"{self.base_url}/strategies/deploy",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={
                "address": self.address,
                "strategy": "uniswap-v4-autocompound"
            }
        ).json()
    
    def harvest_yield(self):
        return requests.post(
            f"{self.base_url}/strategies/harvest",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={"address": self.address}
        ).json()
```

## Method 4: Using Bankr CLI

```bash
# Install Bankr CLI
npm install -g @bankr/cli

# Or via cargo
cargo install bankr-cli

# Tokenize agent
bankr tokenize --agent 0x...

# Deploy yield strategy
bankr strategy deploy --agent 0x... --chain base

# Check status
bankr status --agent 0x...
```

## Method 5: MCP Integration

If using Model Context Protocol:

```json
{
  "name": "bankr",
  "tools": [
    {
      "name": "tokenize_agent",
      "description": "Tokenize an AI agent for treasury management",
      "inputSchema": {
        "type": "object",
        "properties": {
          "agentAddress": {"type": "string"},
          "autoLPDeployment": {"type": "boolean"}
        }
      }
    }
  ]
}
```

## Key Bankr Endpoints

| Operation | Endpoint | Method |
|-----------|----------|--------|
| Tokenize | `/v1/tokenize` | POST |
| Deploy Strategy | `/v1/strategies/deploy` | POST |
| Harvest Yield | `/v1/strategies/harvest` | POST |
| Check Status | `/v1/status` | GET |
| Get Balance | `/v1/balance` | GET |
| Execute Transaction | `/v1/transactions` | POST |

## Environment Setup

```bash
# Required
export BANKR_API_KEY=<your-api-key>
export AGENT_ADDRESS=<your-agent-wallet>

# Optional
export BANKR_CHAIN=base      # Default: base
export YIELD_TARGET=USDC     # Default: USDC
export HARVEST_INTERVAL=3600 # Default: 1 hour (seconds)
```

## Real-World Example: @AxiomBot Model

```javascript
// 1. Deploy agent wallet
const wallet = await bankr.createWallet(agentAddress);

// 2. Community tokenizes (automatic)
const token = await bankr.waitForCommunityTokenization(agentAddress);

// 3. Deploy LP position
const lpPosition = await uniswap.addLiquidity({
  token0: token.address,
  token1: USDC,
  amount0: wallet.balance,
  fee: 0.05 // 5% fee tier
});

// 4. Enable auto-compounding
await bankr.enableAutoCompound({
  lpPosition: lpPosition.id,
  harvestInterval: 3600,
  reinvestThreshold: ethers.utils.parseEther("100")
});

// 5. Monitor treasury (passive income)
setInterval(async () => {
  const balance = await wallet.getBalance();
  console.log(`💰 Harvested: ${balance.yield} USDC`);
}, 3600000);
```

## Troubleshooting

**Issue: "API key invalid"**
```bash
# Generate new API key at https://bankr.bot/api
export BANKR_API_KEY=<new-key>
```

**Issue: "Agent not tokenized"**
```bash
# Manually trigger tokenization
curl -X POST https://api.bankr.bot/v1/tokenize \
  -H "Authorization: Bearer $BANKR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"address\": \"$AGENT_ADDRESS\"}"
```

**Issue: "Insufficient balance"**
Need gas fees (0.01-0.1 ETH on Base). Fund via:
- Coinbase
- Uniswap
- Bridge from mainnet

## Next Steps

1. Get BANKR_API_KEY from https://bankr.bot
2. Choose integration method above
3. Test with small amounts first
4. Monitor yield harvesting
5. Document results

## Reference

- **Bankr Docs:** https://docs.bankr.bot
- **API Reference:** https://api-docs.bankr.bot
- **GitHub:** https://github.com/bankr-ai/
- **Community:** https://discord.gg/bankr
- **Case Study:** @AxiomBot on X/Twitter
