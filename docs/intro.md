---
id: start
sidebar_position: 1
title: Overview
---

# Getting Started With ArchID

Here we'll discuss [ArchID](https://archid.app)'s mission and value proposition for Archway Network. If you're a developer, and would rather learn by example, hop straight into the [CosmWasm](contracts/intro.md) or [JavaScript](dapps/intro.md) docs.

## What is ArchID?

[ArchID](https://archid.app) is a web3 [Domain Name System (DNS)](https://en.wikipedia.org/wiki/Domain_Name_System) built for [Archway Network](https://archway.io). When someone asks you who you are, you don't answer with the number on your ID, you use your name. [ArchID](https://archid.app) is who you are in [Archway](https://archway.io), a name for your address and so much more.

We're familiar with using web2 [DNS](https://en.wikipedia.org/wiki/Domain_Name_System) for websites, it allows us to type [archid.app](https://archid.app) into the URL bar of our web browser instead of the [IP address](https://en.wikipedia.org/wiki/IP_address) [100.27.31.224](http://100.27.31.224). 

Web3 [DNS](https://en.wikipedia.org/wiki/Domain_Name_System) provides a similar service for blockchain addresses. When you're sending funds, instead of typing a canonical chain adddress like [archway1n7d4c52knwqqkw9j975ranknkp4fn3we0unrp6](https://archid.app/address/archway1n7d4c52knwqqkw9j975ranknkp4fn3we0unrp6), you can send to a memorable address like [archid.arch](https://archid.app/domains/archid.arch).

Sending to an [ArchID](https://archid.app) address will soon be supported in [Cosmostation](https://cosmostation.io/products/cosmostation_extension) and [Leap](https://www.leapwallet.io/) wallets.


## Why Another Web3 Name Service?

Sure, you’ve heard of Starname and ICNS for Cosmos. You’ve looked at ENS and Unstoppable Domains on Ethereum and Polygon. Does the metaverse really need another domain name service?

We believe yes, and here’s why. What makes [ArchID](https://archid.app) special is its core features which are not available from other web3 name services. These features are:

- NFTs with updatable metadata
- Support for subdomains

### Updatable NFTs

<img data="pad-vertical" alt="Updatable NFTs" src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*De-AXOPcnXWa9kqN9WpihQ.png" width="600" />

Most web3 name services use NFT assets to represent domain ownership. The drawback is, once a domain NFT has been created, it must be burned and re-minted each time the domain record needs to be modified.

The problem this presents is web3 domains, like web2 [DNS records](https://web.archive.org/web/20230405212048/https://www.bluehost.com/help/article/dns-records-explained), are records that expire and need to be renewed periodically. However, burning an expired domain NFT, and re-minting it with a new expiry date, is costly for the end user because of its inefficient gas usage. It’s also a strange and counter intuitive experience. Since renewing ownership is a destructive practice, you need to wait until the domain is actually expired before paying for renewal (otherwise, you’d be burning your NFT too early, and not getting the full value of your registration purchase).

Until recently, there was no standard for updating the metadata of an NFT. Most NFTs store their metadata on [IPFS](https://ipfs.tech) (not the blockchain), which is immutable data, anyway. [ArchID NFTs (AID)](https://www.mintscan.io/archway/wasm/contract/archway1cf5rq0amcl5m2flqrtl4gw2mdl3zdec9vlp5hfa9hgxlwnmrlazsdycu4l) make use of [CosmWasm](https://cosmwasm.com)'s [cw721-metadata-onchain](https://lib.rs/crates/cw721-metadata-onchain) package, which enables storing NFT metadata on the blockchain. We also use an extension called [cw721-updatable](https://github.com/archway-network/cw721-updatable) which enables approved token operators to update the metadata of any [AID token](https://www.mintscan.io/archway/wasm/contract/archway1cf5rq0amcl5m2flqrtl4gw2mdl3zdec9vlp5hfa9hgxlwnmrlazsdycu4l). 

[ArchID](https://archid.app) domains can be updated, extended and repeatably customized by their owners for minimal gas fees. [ArchID](https://archid.app) domains don’t need to be burned unless an expired domain is purchased by a new owner. The burden of increased gas fees for burning tokens, only effects buyers taking an expired domain away from a previous owner.

<img data="pad-vertical" alt="Updatable NFTs" src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*6Vy5YH22yasV1MwWMMHHkQ.png" width="600" />


### Subdomains

In web2 [DNS](https://en.wikipedia.org/wiki/Domain_Name_System), it's normal for records to be customized. In addition to customizable entries, it’s common to create [subdomain](https://en.wikipedia.org/wiki/Subdomain) records which share an expiry time with their top level domain. [ArchID](https://archid.app) has full support for subdomains.

<img data="pad-vertical" alt="Updatable NFTs" src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*HP2qKy5k4QZ6_3gQ1fYXsg.png" width="600" />

Just like top level [ArchID](https://archid.app) domains, subdomain avatar images, domain resolution, and domain description can be updated by their token owner, and ownership of the subdomain can still be transferred to someone else just by sending them the [AID](https://www.mintscan.io/archway/wasm/contract/archway1cf5rq0amcl5m2flqrtl4gw2mdl3zdec9vlp5hfa9hgxlwnmrlazsdycu4l) NFT. 

Unlike top level ArchID domains, subdomain profile information such as GitHub and Twitter accounts, and email and website addresses, cannot be added. Subdomains also can’t mint other subdomains.


## ArchID for Developers

[ArchID](https://archid.app) was built with developers in mind. Developers can leverage the following subdomain workflow for their applications:

1. Create a top level domain using the address that deployed the dapp smart contract
2. Create a subdomain that resolves its domain record to the dapp smart contract address. You can retain ownership of the subdomain NFT in case you ever want to invalidate or modify the subdomain record.
3. Under Websites & Apps, add a website to the top level domain. Point the domain record for this website to the subdomain you created in step 2.

After performing the above steps, users looking up, either your contract addresses or account address, can find your domain and subdomain records. This can help verify you as the creator of the project. It provides a safe way to link your dapp website with a smart contract address, and share external links to your GitHub and social profiles. 

You can also update any information if it becomes invalid. For example, in the extreme case of an account compromise. If you Archway private key is secure, you can update or remove any compromised accounts that were previously associated to your domain.

<img data="pad-center" alt="ArchID" src="/img/token.svg" />