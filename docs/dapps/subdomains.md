---
id: subdomains
sidebar_position: 7
title: Managing Subdomains
---

Subdomains are a special class of ArchID domains with some special rules. Owners of both top-level domains and subdomains can [Update Domain Data](/docs/dapps/updating#updating-domain-data) using the same entry point (`UpdateUserDomainData`); but, unlike top-level domains, subdomains cannot [Update Name Resolution](/docs/dapps/updating#updating-name-resolution). 

If a subdomain's [Name Resolution](/docs/dapps/resolution) is invalid, or otherwise needs to be updated, the top-level domain owner must [Remove](#removing-a-subdomain) it and [Register](/docs/dapps/registration#registering-a-subomain) it again for the changes to be applied. These restrictions are a security measure, because subdomains can be owned and updated by owners who are not the top-level domain owner. Subdomain owners who do not also own the top-level domain should be aware that the top-level owner has the ability to burn their subdomain.

Subdomain lifetimes can also be [extended](#renewing-a-subdomain).

## Renewing a Subdomain

Owners can extend the lifetimes of subdomains by calling the `ExtendSubdomainExpiry` entry point. It is free to extend the lifetime of a subdomain, minus the cost of gas fees. 

`ExtendSubdomainExpiry` is an entry point that takes three parameters, which are the top-level domain (`domain`), the subdomain to be extended (`subdomain`) and the new expiration date (`expiration`).

Here's an example of how we could call `ExtendSubdomainExpiry`, and extend the lifetime of a subdomain.

```js
/**
 * Extend subdomain expiry
 * @param {String} domain : Registered top level domain
 * @param {String} subdomain : Registered sub-domain to be revoked
 * @param {Number} expiration : New expiry timestamp
 * @returns {ExecuteResult}
 */
async function extendSubdomainExpiry (domain = null, subdomain = null, expiration = null) {
 if (!domain || !subdomain || !expiration) return;
 // CW Client
  let client = await getClient();
  // Sender
  let accounts = await getAccounts();
  try {
    let entrypoint = {
      extend_subdomain_expiry : {
        domain: domain,
        subdomain: subdomain,
        expiration: expiration
      }
    };
    
    let tx = await client.execute(
      accounts[0].address,
      REGISTRY_CONTRACT,
      entrypoint,
      "auto",
      "Renewing subdomain"
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

async function resolveRecord(name = null) {
  if (!name) return;
  let client = await getClient();
  try {
    let entrypoint = {resolve_record: {name: name}};
    let query = await client.queryClient.wasm.queryContractSmart(REGISTRY_CONTRACT,entrypoint);
    return query;
  } catch(e) {
    return {error: e};
  }
}

async function doSubdomainRenewal() {
  // highlight-start
  // Do not add the `.arch` suffix
  let domain = "archid"; 
  // Add only subdomain prefix
  let subdomain = "dapp";
  // highlight-end
  // After updating the top level domain, e.g.
  // let years = 1
  // let renewal = await renewRegistration(domain, years);
  // console.log(renewal);
  let domain_record = resolveRecord(domain);
  let subdomain_renewal = await extendSubdomainExpiry(domain, subdomain, domain_record.expiration);
  console.log(subdomain_renewal);
  return subdomain_renewal;
}
```

:::tip Expiration
`expiration` is a value, denominated in seconds, that must be larger than a subdomain's current expiration, and cannot exceed the expiration of its top-level domain.
:::

## Removing a Subdomain

There are two cases when you may want to remove a subdomain.

1. Subdomain is expired and won't be renewed, but the top-level domain will be renewed
2. Subdomain [Name Resolution](/docs/dapps/resolution) needs to be changed

Top-level domain owners can remove a subdomain using the `RemoveSubdomain` entry point which takes `domain` and a `subdomain` as it's arguments.

Here's an example of how a subdomain can be removed.

```js
/**
 * Burn a subdomain
 * @param {String} domain : Registered top level domain
 * @param {String} subdomain : Registered sub-domain to be revoked
 * @returns {ExecuteResult}
 */
async function RemoveSubdomain(domain = null, subdomain = null) {
 if (!domain || !subdomain) return;
 // CW Client
  let client = await getClient();
  // Sender
  let accounts = await getAccounts();
  try {
    let entrypoint = {
      remove_subdomain: {
        domain: domain,
        subdomain: subdomain
      }
    };
    
    let tx = await client.execute(
      accounts[0].address,
      REGISTRY_CONTRACT,
      entrypoint,
      "auto",
      "Removing subdomain"
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

async function doRemoveSubdomain() {
  // highlight-start
  // Do not add the `.arch` suffix
  let domain = "archid"; 
  // Add only subdomain prefix
  let subdomain = "dapp";
  // highlight-end
  let removal = await renewRegistration(domain, subdomain);
  console.log(removal);
  return removal;
}
```

:::caution
Removing a subdomain will burn the subdomain ownership NFT. This action cannot be undone, but it is possible to register the same subdomain name again.
:::