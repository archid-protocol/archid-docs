---
id: resolution
sidebar_position: 3
title: Name Resolution
---

Name resolution allows us to check if a given domain exists and is not expired. Name resolution is handled by the `ResolveRecord` entry point in the Registry contract.

`ResolveRecord` is a `QueryMsg` type which accepts one parameter (`name`).

:::info Format Rules

When querying `ResolveRecord` there several rules that must be followed. These rules also define what is a valid domain name in the ArchID domain system.

1. `name` must end with `.arch`
2. `name` must not contain invalid domain characters; acceptable characters are: `a-z` (alphabetic), `0-9`(numeric), `.` (periods), `_` (underscores) and `-` (hyphens)
3. `name` must not contain more than two `.` characters
4. Domain (the part before `.arch`) is at least 3 characters
5. The domain (the part before `.arch`) is not more than 64 characters

There will always be one `.` character, because of the `.arch` suffix. A second `.` character will only be present if you are resolving a subdomain record.
:::

## Resolving a Domain Record

When querying `ResolveRecord`, there are three cases that would cause an error response.

1. `name` is invalid (see format rules)
2. `name` is expired
3. `name` does not yet exist

Here's an example of how we might call the `ResolveRecord` entry point.

```js
const REGISTRY_CONTRACT = "archway1275jwjpktae4y4y0cdq274a2m0jnpekhttnfuljm6n59wnpyd62qppqxq0";

async function resolveRecord(name = null) {
  if (!name) return;
  let client = await getClient();
  try {
    let entrypoint = {
      resolve_record: {
        name: name
      }
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
```

Here's what the response looks like for a valid, non-expired domain record.

```json
{
  "address": "archway1n7d4c52knwqqkw9j975ranknkp4fn3we0unrp6",
  "expiration": 1751466919
}
```

:::info
The `expiration` returned by `ResolveRecord` is a [Unix Timestamp](https://en.wikipedia.org/wiki/Unix_time) denominated in seconds.

Note that querying `ResolveRecord` for an expired domain will return an error.
:::

Here's what it looks like when `ResolveRecord` returns an error reponse, as might happen if the domain name is invalid, expired, or the name format is incorrect.

```json
{
  "error": "Error: Query failed with (18): Error calling the VM: Error executing Wasm: Wasmer runtime error: 
      RuntimeError: unreachable: query wasm contract failed: invalid request
      at QueryClient.queryAbci (/home/archway/archid/node_modules/@cosmjs/stargate/build/queryclient/queryclient.js:134:19)
      at processTicksAndRejections (internal/process/task_queues.js:95:5)
      at async Object.request (/home/archway/archid/node_modules/@cosmjs/stargate/build/queryclient/utils.js:35:30)
      at async Object.queryContractSmart (/home/archway/archid/node_modules/@cosmjs/cosmwasm-stargate/build/modules/wasm/queries.js:59:34)
      at async ResolveRecord (REPL53:9:17)
      at async test (REPL102:1:36)"
}
```

## Resolving a Domain's Data

Resolve detailed domain data with the usual metadata query for `cw721` tokens (`NftInfo`) using ArchID's  [cw721 address](/docs/dapps/intro#smart-contract-addresses) and the domain (`token_id`) to request data for. 

Here's an example of how we might call the `NftInfo` entry point.

```js
const CW721_CONTRACT = "archway1cf5rq0amcl5m2flqrtl4gw2mdl3zdec9vlp5hfa9hgxlwnmrlazsdycu4l";

async function tokenMetadata (tokenId = null) {
  if (!tokenId) return;
  let client = await getClient();
  try {
    let entrypoint = {
      nft_info: {
        token_id: tokenId
      }
    };
    let query = await client.queryClient.wasm.queryContractSmart(
      CW721_CONTRACT,
      entrypoint
    );
    return query;
  } catch(e) {
    return {error: e};
  }
}
```

Here's what the query response is like for `NftInfo`, for a `token_id` that exists.

```json
{
  "token_uri": null,
  "extension": {
    "name": "archid.arch",
    "description": "A decentralized name service with support for domains, subdomains, and web2 identity verifcation",
    "image": "ipfs://QmNoMUgTM82EGaTCTnuEUJDusV21UEGSgKM5RhM1C9N3WE",
    "created": 1680023536,
    "expiry": 1710023536,
    "domain": "archid.arch",
    "subdomains": [
      {
        "name": "dapp",
        "resolver": "archway100vemsuja6h7k5ygve3xz3yzgapdj6zpe00ffg8d95hpwj9d8v5q8zc9zh",
        "created": 1680023944,
        "expiry": 1705788708
      }
    ],
    "accounts": [
      {
        "username": "archid-protocol",
        "profile": "https://github.com/archid-protocol",
        "account_type": "github",
        "verfication_hash": null
      }
    ],
    "websites": [
      {
        "url": "https://archid.app",
        "domain": "dapp.archid.arch",
        "verfication_hash": null
      }
    ]
  }
}
```

:::tip Using `NftInfo` to Show User Profiles

Since, [AID](https://testnet.mintscan.io/archway-testnet/wasm/contract/archway146htsfvftmq8fl26977w9xgdwmsptr2quuf7yyra4j0gttx32z3secq008) tokens return a user's social accounts, websites and apps and customized avatar, developers can use ArchID as a [Gravatar](https://en.gravatar.com)-like service for the [Archway Network](https://archway.io)
:::


Here's what the query response is like for `NftInfo`, when the queried `token_id` doesn't exist.

```json
{
  "error": "Error: Query failed with (18): cw721_archid::state::TokenInfo<core::option::Option<archid_token::Metadata>> 
      not found: query wasm contract failed: invalid request
      at QueryClient.queryAbci (/home/archway/archid/node_modules/@cosmjs/stargate/build/queryclient/queryclient.js:134:19)
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:95:5)
      at async Object.request (/home/archway/archid/node_modules/@cosmjs/stargate/build/queryclient/utils.js:35:30)      at async Object.queryContractSmart (/home/archway/archid/node_modules/@cosmjs/cosmwasm-stargate/build/modules/wasm/queries.js:59:34)
      at async tokenMetadata (REPL147:10:17)
      at async test (REPL159:1:36)"
}
```