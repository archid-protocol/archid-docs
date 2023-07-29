---
id: updating
sidebar_position: 5
title: Updating Domains
---

To enable having your users update their ArchID avatar or social profile data, from within your application, use the `UpdateUserDomainData` entry point of the [Registry contract](https://www.mintscan.io/archway/wasm/contract/archway1275jwjpktae4y4y0cdq274a2m0jnpekhttnfuljm6n59wnpyd62qppqxq0).

`UpdateUserDomainData` takes a `` object as an argument. 

There could be a lot of metadata attached to the user's domain. Be sure to load the original domain data first. Users should modify the current values before sending an `UpdateUserDomainData` transaction that will replace most of metadata values in their token.

:::info Token Metadata
There are several types of domain data which are not customizable by end users.

These are:

- `name` {String} : Name is always the same as the `domain` field and `token_id`. It exists for interoperability with cw721 marketplaces.
- `created` {Number} : Unix timestamp when the domain was created
- `expiry` {Number} : Unix timestamp when the domain will expire
- `subdomains` {Object} : Subdomains are configured and managed by other entry points, see [Managing Subdomains](/docs/dapps/subdomains)

The following data fields of ArchID domains _can_ be updated by AID token owners.

- `description` {String} : A user defined description or short auto-biography
- `image` {String} : A URL (https://...) or IPFS link (ipfs://...) to the user's avatar
- `accounts` {Object} : `accounts` are social profile objects. They can have the following fields (all strings): `username`, `profile`, `account_type`, `verification hash`.
- `websites` {Object} : `websites` are objects that represent websites and applications. They can have the following fields (all strings): `url` (https://...), `domain` (ArchID domain to use for this website), `verification_hash`.
:::

Here's an example of how we can call the `UpdateUserDomainData` entry point, which takes two parameters, a domain name (`name`) to be updated, and the domain data (`metdata_update`) update to be processed.

```js
const REGISTRY_CONTRACT = "archway1275jwjpktae4y4y0cdq274a2m0jnpekhttnfuljm6n59wnpyd62qppqxq0";

async function updateDomainData(name = null, metadata_update = null) {
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
    let tx = await client.wasmClient.execute(
      accounts[0].address,
      REGISTRY_CONTRACT,
      entrypoint,
      client.fees,
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
  let txResult = await updateDomainData(domain, metadata_update);
  console.log(txResult);
}
```