---
id: intro
sidebar_position: 1
title: Introduction
---

# Dapp Developers

Read on to learn how you can integrate the following [ArchID](https://archid.app) features in your Dapps and web applications:

- [Registering and minting domains](/docs/dapps/registration)
- [Name resolution and resolving domain data](/docs/dapps/resolution)
- [Updating domain data](/docs/dapps/updating)
- [Extending domain lifetimes](/docs/dapps/extending)


## Smart Contract Addresses

See below for the smart contract addresses of the [ArchID](https://archid.app) Registry and NFT contracts.

:::note Mainnet
**Chain ID:** `archway-1`

**Registry:** [archway1275jwjpktae4y4y0cdq274a2m0jnpekhttnfuljm6n59wnpyd62qppqxq0](https://www.mintscan.io/archway/wasm/contract/archway1275jwjpktae4y4y0cdq274a2m0jnpekhttnfuljm6n59wnpyd62qppqxq0)

**Cw721:** [archway1cf5rq0amcl5m2flqrtl4gw2mdl3zdec9vlp5hfa9hgxlwnmrlazsdycu4l](https://www.mintscan.io/archway/wasm/contract/archway1cf5rq0amcl5m2flqrtl4gw2mdl3zdec9vlp5hfa9hgxlwnmrlazsdycu4l)
:::

:::note Testnet
**Chain ID:** `constantine-3`

**Registry:** [archway1lr8rstt40s697hqpedv2nvt27f4cuccqwvly9gnvuszxmcevrlns60xw4r](https://testnet.mintscan.io/archway-testnet/wasm/contract/archway1lr8rstt40s697hqpedv2nvt27f4cuccqwvly9gnvuszxmcevrlns60xw4r)

**Cw721:** [archway146htsfvftmq8fl26977w9xgdwmsptr2quuf7yyra4j0gttx32z3secq008](https://testnet.mintscan.io/archway-testnet/wasm/contract/archway146htsfvftmq8fl26977w9xgdwmsptr2quuf7yyra4j0gttx32z3secq008)
:::


## JavaScript Client

The following docs reference a `client` JavaScript object. Assume you are working with an [arch3.js](https://www.npmjs.com/package/@archwayhq/arch3.js) client object.

Here's an example of getting an [arch3.js](https://www.npmjs.com/package/@archwayhq/arch3.js) client.

```js
const Arch3 = require('@archwayhq/arch3.js');

const Blockchain = {
  chainId: "archway-1",
  chainName: "Archway",
  rpc: "https://rpc.mainnet.archway.io",
  stakeCurrency: {coinDenom: "ARCH",coinMinimalDenom: "aarch",coinDecimals: 6,},
  bech32Config: {bech32PrefixAccAddr: "archway",bech32PrefixAccPub: "archwaypub",bech32PrefixValAddr: "archwayvaloper",bech32PrefixValPub: "archwayvaloperpub",bech32PrefixConsAddr: "archwayvalcons",bech32PrefixConsPub: "archwayvalconspub"},
  currencies: [{coinDenom: "ARCH",coinMinimalDenom: "aarch",coinDecimals: 18,}],
  feeCurrencies: [{coinDenom: "ARCH",coinMinimalDenom: "aarch",coinDecimals: 18,gasPriceStep: {low: 0,average: 0.1,high: 0.2},}],
  features: ['cosmwasm']
};

// Keplr example
async function getClient() {
  await window.keplr.experimentalSuggestChain(Blockchain);
  await window.keplr.enable(Blockchain.chainId);
  window.keplr.defaultOptions = {sign:{preferNoSetFee: true}};
  const signer = await window.getOfflineSignerAuto(Blockchain.chainId);
  const client = await Arch3.SigningArchwayClient.connectWithSigner(Blockchain.rpc, signer);
  return client;
}

async function getAccounts() {
  const signer = await window.getOfflineSignerAuto(Blockchain.chainId);
  const accounts = signer.getAccounts();
}
```


## Compatibiilty

The following docs assume you are integrating [ArchID](https://archid.app) into a web application using [JavaScript](https://en.wikipedia.org/wiki/JavaScript).

If you're looking to integrate [ArchID](https://archid.app) into a smart contract see the [Contract docs](/docs/contracts/intro).