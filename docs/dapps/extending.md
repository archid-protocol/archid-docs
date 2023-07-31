---
id: extending
sidebar_position: 6
title: Extending Lifetimes
---

Top-level domains and subdomain lifetimes can be updated by domain owners. 

In this doc we'll learn about extending lifetimes of top-level domains. If you're looking to extend a subdomain's lifetime, see [Managing Subdomains](/docs/dapps/subdomains).

## Calculating a Renewal Cost

Extending a domain's lifetime is similar to [Registration](/docs/dapps/registration#registering-a-domain), in that you will need to calculate the renewal cost based on the `base_cost` and `base_expiration` values stored in the [Registry](https://www.mintscan.io/archway/wasm/contract/archway1275jwjpktae4y4y0cdq274a2m0jnpekhttnfuljm6n59wnpyd62qppqxq0). 

`base_cost` and `base_expiration` can be fetched by querying the `Config` query entry point of the Registry. 

```js
async function config() {
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

async function getConfig() {
  let config = await config();
  console.log(config);
  return config;
}
```

The `Config` entry point returns a response like this:

```json
{
  "admin": "archway1n7d4c52knwqqkw9j975ranknkp4fn3we0unrp6",
  "wallet": "archway1n7d4c52knwqqkw9j975ranknkp4fn3we0unrp6",
  "cw721": "archway1cf5rq0amcl5m2flqrtl4gw2mdl3zdec9vlp5hfa9hgxlwnmrlazsdycu4l",
  "base_cost": "1000000000000000000",
  "base_expiration": 31536000
}
```

Here's an example of how we might compute the cost to renew a domain record.

```js
// Gets `base_cost` and `base_expiration`
async function config() {
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
    const config = await config();
    // `base_cost` is a value in `aarch` (mainnet) or `aconst` (testnet) 
    // it's stored in the registry contract as a string
    let base_cost = Number(config.base_cost);
    // Calculate registration cost
    let registration_cost = base_cost * years;
    return parseInt(registration_cost);
}
```

## Renewing a Domain

To renew a domain, execute a transaction to the `RenewRegistration` entry point of the ArchID Registry contract. `RenewRegistration` takes 1 argument parameter (`name`). At least 1x the `base_cost` must be sent in the `funds` of the transaction. 

The multiple of `base_cost` sent in the `funds` of the transaction must be a valid renewal lifetime. The maximum domain lifetime is 3x the `base_cost`. The maximum renewal life time, for a `RenewRegistration` transaction, is the maximum number of unregistered years, which could be 0, 1, or 2.

Here's an example of how to execute the `RenewRegistration` entry point and extend a domain's lifetime.
```js
/**
 * Renew registration of a domain
 * @param {String} name : Registered domain name to be renewed
 * @param {Number} years : Number of years to be renewed for; an integer between 1 and 3, impacts cost
 * @returns {ExecuteResult}
 */
async function renewRegistration(name = null, years = null) {
  if (!name || !years) return;
  // CW Client
  let client = await getClient();
  // Sender
  let accounts = await getAccounts();
  // Cost
  let cost = registrationCost(years);
  // Convert cost to aarch (mainnet) or aconst (testnet)
  let funds = [coin(String(cost), "aarch")];

  try {
    let entrypoint = {
      renew_registration: {
        name: name
      }
    };
    let tx = await client.execute(
      accounts[0].address,
      REGISTRY_CONTRACT,
      entrypoint,
      "auto",
      "Renewing domain registration",
      funds
    );
    // Tx result
    return tx;
  } catch (e) {
    console.error(e);
    return {
      error: String(e)
    };
  }
}

async function doRenewal() {
  // highlight-start
  // Do not add the `.arch` suffix when renewing a domain 
  let domain = "archid"; 
  // highlight-end
  let years = 1;
  let renewal = await renewRegistration(domain, years);
  console.log(renewal);
  return renewal;
}
```