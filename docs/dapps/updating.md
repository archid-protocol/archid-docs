---
id: updating
sidebar_position: 5
title: Updating Domains
---

There are three types of domain data that can be updated by domain owners. 

In this doc, we'll learn about updating [Name Resolution](#updating-domain-data) and updating [Domain Data](#updating-domain-data). Domain Lifetimes can also be updated (extended), that's discussed in [Extending Lifetimes](/docs/dapps/extending). Updating subdomains works differently, that's discussed in [Managing Subdomains](/docs/dapps/subdomains).

## Updating Name Resolution

Users can update the [Name Resolution](/docs/dapps/resolution) of their domains by sending a transaction to the `UpdateResolver` entry point.

`UpdateResolver` takes a domain string (`name`) and an Archway address (`new_resolver`). Where, `name` is the domain to be updated, and `new_resolver` is the new Archway address the domain will resolve to.

Here's an example of how we can call the `UpdateResolver` entry point.

```js
/**
 * Update domain resolution
 * @param {String} name : Domain name to be updated
 * @param {String} new_resolver : An Archway Network Addr type
 * @returns {ExecuteResult}
 */
async function updateResolver(name = null, new_resolver = null) {
  if (!name || !new_resolver) return;
  // CW Client
  let client = await getClient();
  // Sender
  let accounts = await getAccounts();

  // Update Domain Data
  try {
    // Msg.
    let entrypoint = {
      update_resolver: {
        name: name,
        new_resolver: new_resolver
      }
    };
    // Broadcast tx
    let tx = await client.execute(
      accounts[0].address,
      REGISTRY_CONTRACT,
      entrypoint,
      "auto",
      "Updating resolver" // Memo
    );
    // Tx result
    return tx;
  } catch (e) {
    return { error: String(e) };
  }
}

async function doResolverUpdate() {
  let domain = "archid.arch";
  let new_resolver = "archway1f395p0gg67mmfd5zcqvpnp9cxnu0hg6r9hfczq";
  let txResult = await updateResolver(domain, new_resolver);
  console.log(txResult);
}
```

## Updating Domain Data

To enable having your users update their ArchID avatar or social profile data from within your application, use the `UpdateUserDomainData` entry point of the [Registry contract](https://www.mintscan.io/archway/wasm/contract/archway1275jwjpktae4y4y0cdq274a2m0jnpekhttnfuljm6n59wnpyd62qppqxq0).

`UpdateUserDomainData` takes two arguments: a domain name (`name`) to be updated, and a domain data object (`metdata_update`) to be processed.

There could be a lot of metadata attached to the user's domain. Be sure to load the original domain data first ([see example](/docs/dapps/resolution#resolving-a-domains-data)) so you don't overwrite any parameters with `null` values when you send the update transaction.

:::info Token Metadata
There are several types of domain data which are not customizable by end users.

These are:

- `name` {String} : Name is always the same as the `domain` field and `token_id`. It exists for interoperability with cw721 marketplaces.
- `created` {Number} : Unix timestamp when the domain was created
- `expiry` {Number} : Unix timestamp when the domain will expire
- `subdomains` {Object} : Subdomains are configured and managed by other entry points, see [Managing Subdomains](/docs/dapps/subdomains)

The following data fields of ArchID domains _can_ be updated by [AID token](https://www.mintscan.io/archway/wasm/contract/archway1cf5rq0amcl5m2flqrtl4gw2mdl3zdec9vlp5hfa9hgxlwnmrlazsdycu4l) owners.

- `description` {String} : A user defined description or short auto-biography
- `image` {String} : A URL (https://...) or IPFS link (ipfs://...) to the user's avatar
- `accounts` {Object} : `accounts` are social profile objects. They can have the following fields (all strings): `username`, `profile`, `account_type`, `verification hash`.
- `websites` {Object} : `websites` are objects that represent websites and applications. They can have the following fields (all strings): `url` (https://...), `domain` (ArchID domain to use for this website), `verification_hash`.
:::

Here's an example of how we can call the `UpdateUserDomainData` entry point.

```js
/**
 * Update metadata of a domain you own.
 * @param {String} name : Domain name to be updated
 * @param {Object} metadata_update : New metadata object to be updated 
 * @returns {ExecuteResult}
 */
async function updateUserDomainData(name = null, metadata_update = null) {
  if (!name || !metadata_update) return;
  // CW Client
  let client = await getClient();
  // Sender
  let accounts = await getAccounts();

  // Update Domain Data
  try {
    // Msg.
    let entrypoint = {
      update_user_domain_data: {
        name: name,
        metadata_update: metadata_update
      }
    };
    // Broadcast tx
    let tx = await client.execute(
      accounts[0].address,
      REGISTRY_CONTRACT,
      entrypoint,
      "auto",
      "Updating user domain data" // Memo
    );
    // Tx result
    return tx;
  } catch (e) {
    return { error: String(e) };
  }
}

async function doDomainUpdate() {
  let domain = "archid.arch";
  let metadata_update = {
    // Change the description
    description: "I'm changing the token description",
    // Other properties stay the same
    image: "ipfs://QmNoMUgTM82EGaTCTnuEUJDusV21UEGSgKM5RhM1C9N3WE",
    accounts: [{username: "archid-protocol",profile: "https://github.com/archid-protocol",account_type: "github",verfication_hash: null}],
    websites: [{url: "https://archid.app",domain: "dapp.archid.arch",verfication_hash: null}]
  };
  let txResult = await updateUserDomainData(domain, metadata_update);
  console.log(txResult);
}
```

:::tip Domain Asset Transfers

Domain ownership can be transferred to another party by sending them the Domain's cw721 token, but note that transferring [AID tokens](https://www.mintscan.io/archway/wasm/contract/archway1cf5rq0amcl5m2flqrtl4gw2mdl3zdec9vlp5hfa9hgxlwnmrlazsdycu4l) does not automatically update their data.

Each time a domain gets a new owner, it is the owner's responsibility to update the [Name Resolution](#updating-domain-data) and [Domain Data](#updating-domain-data)
:::