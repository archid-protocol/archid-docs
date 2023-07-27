---
id: registration
sidebar_position: 2
title: Name Registration
---

Before registering a new domain or subdomain, it will be important to check if it's available to be registered. We can query the `ResolveRecord` entry point to check if any non-expired domain exists.

For more information about `ResolveRecord`, and name resolution in general, see [Name Resolution](/docs/dapps/resolution).


## Calculating a Registration Cost

Before registering the domain, it will also be important to calculate the registration cost. This amount will dictate the length of the domain lifetime. 

For convenience, we call the `base_expiration` amount "years", because on mainnet `base_expiration` is configured to be a duration of 1 year (denominated in seconds). Domains can be registered for 1, 2 or 3 years. Paying an amount equal to, or more than, 3x the `base_cost` will result in a registration of 3 years. Paying less than 1x the `base_cost` will result in a failing transaction. 

`base_cost` is denominated in `aarch` on mainnet and `aconst` on testnet. 

We can get the `base_cost` by querying the `Config` entry point of the Registry contract. It doesn't take any arguments as parameters.

Here's an example of how we might call the `Config` entry point and determine the real-time cost of domain registration per year.

```js
const REGISTRY_CONTRACT = "archway1275jwjpktae4y4y0cdq274a2m0jnpekhttnfuljm6n59wnpyd62qppqxq0";

async function Config() {
  let client = await getClient();
  try {
    let entrypoint = {
      config: {}
    };
    let query = await client.queryClient.wasm.queryContractSmart(
      REGISTRY_CONTRACT,
      entrypoint
    );
    return query;
  } catch(e) {
    return {error: e};
  }
}

// Calculate registration cost for 1, 2 or 3 year domain lifetimes
async function registrationCost(years = 1) {
    if (typeof years !== 'number') years = 1;
    if (years < 1) years = 1;
    if (years > 3) years = 3;
    const config = await Config();
    // `base_cost` is a value in `aarch` (mainnet) or `aconst` (testnet) 
    // it's stored in the registry contract as a string
    let base_cost = Number(config.base_cost);
    // Calculate registration cost
    let registration_cost = base_cost * years;
    return parseInt(registration_cost);
}
```


## Registering a Domain

To register a new domain, execute a transaction to the `Register` entry point of the ArchID Registry contract. `Register` takes 1 argument parameter (`name`). At least 1x the `base_cost` must be sent in the `funds` of the transaction.

Here's an example of how to execute the `Register` entry point to mint a new domain name.

```js
async function registerDomain() {
  // CW Client
  let client = await getClient();
  // Sender
  let accounts = await getAccounts();
  // Cost
  let cost = registrationCost(2); // 2 year registration
  // Convert cost to aarch (mainnet) or aconst (testnet)
  let funds = [coin(String(cost), client.chainInfo.currencies[0].coinMinimalDenom)];

  // Register a domain
  try {
    let entrypoint = {
      register: {
        // highlight-start
        // Do not add the `.arch` suffix when registering a domain 
        name: 'archid'
        // highlight-end
      }
    };
    
    // Broadcast tx
    let tx = await client.execute(
      accounts[0].address,
      REGISTRY_CONTRACT,
      entrypoint,
      "auto",
      "Registering domain", // Memo
      funds
    );
    // Tx result
    return tx;
  } catch (e) {
    return { error: String(e) };
  }
}
```

## Registering a Subomain

Register a subdomain is slightly more complicated than registering a top-level domain. The entry point to be called is `RegisterSubdomain` (or `register_subdomain` as it's written in snake case for [arch3.js](https://www.npmjs.com/package/@archwayhq/arch3.js)).

`RegisterSubdomain` takes the following arguments.

1. {String} `domain`: Top-level domain minting the subdomain (without the `.arch` suffix)
2. {String} `subdomain`: Subdomain prefix to be minted
3. {String | Addr} `new_resolver`: Archway address the subdomain record will resolve to
4. {String | Addr} `new_owner`: Archway address who will own and manage the subdomain record
5. {Boolean} `mint`: Normally should be set to true
6. {Number} `expiration`: Unix Timestamp denominated in seconds; must be in the future and cannot be larger than the expiration of the top-level domain

:::caution `mint` Registration Parameter

It is possible to create subdomain records without minting an ownership NFT (e.g. `mint` set to `false`), though it is not recommended. Doing so will save you gas costs, but you won't be able to re-configure the record afterwards, only remove it.
:::

Unlike top-level domains, minting subdomains does not cost a per year registration fee. Minus gas fees, they are free to create and manage but subdomain lifetimes cannot exceed the lifetime of their top-level domain.

Here's an example of how to execute the `RegisterSubdomain` entry point to mint a new subdomain.

```js
async function registerSubdomain() {
  // CW Client
  let client = await getClient();
  // Sender
  let accounts = await getAccounts();

  // Register subdomain domain
  try {
    let entrypoint = {
      register_subdomain: {
        // highlight-start
        // Do not add the `.arch` suffix of the top-level domain 
        domain: "archid",
        // highlight-end
        // Subdomain prefix for 'dapp.archid.arch'
        subdomain: "dapp",
        // 'dapp.archid.arch' will resolve to the ArchID Registry 
        new_resolver: REGISTRY_CONTRACT,
        // but will be managed by the ArchID deployer address
        new_owner: "archway1n7d4c52knwqqkw9j975ranknkp4fn3we0unrp6",
        mint: true,
        // Use the same lifetime as the top-level domain
        expiration: 1751466900
      }
    };
    // Broadcast tx
    let tx = await client.wasmClient.execute(
      accounts[0].address,
      REGISTRY_CONTRACT,
      entrypoint,
      client.fees,
      "Registering subdomain"
    );
    // Tx result
    return tx;
  } catch (e) {
    return { error: String(e) };
  }
}
```

:::info Subdomain Ownership Rules

It's possible to mint a subdomain that resolves to any address, including an address not owned or adminstrated by the caller. 

Top-level domain owners can mint subdomains directly to other parties (`new_owner`) without needing to transfer them the ownership NFT in a second transaction.

Subdomain creators must own the top-level domain minting the subdomain, or else their transaction will fail.
:::