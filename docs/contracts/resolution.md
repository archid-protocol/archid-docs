---
id: cw-resolution
sidebar_position: 3
title: Name Resolution
---

Name resolution allows us to check if a given domain exists and is not expired. Name resolution is handled by the `ResolveRecord` entry point in the Registry contract.

`ResolveRecord` is a `QueryMsg` type which accepts one parameter (`name`).

```js title="archid-registry/src/msg.rs"
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    // highlight-next-line
    ResolveRecord { name: String },
    // More entry points...
}
```

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
use cosmwasm_std::{
    Deps, Env, to_binary, QueryRequest, Response, WasmQuery,
};
use crate::msg::SomeQueryMsg; // Your msg type
use crate::archid_registry;

pub fn some_query_fn(
    msg: SomeQueryMsg,
    deps: DepsMut,
    env: Env,
) -> Result<Response, ContractError> {
    let registry_contract = "archway1275jwjpktae4y4y0cdq274a2m0jnpekhttnfuljm6n59wnpyd62qppqxq0";
    let desired_domain_name = "archid.arch";

    // Create the query msg
    let query_msg: archid_registry::QueryMsg = archid_registry::ResolveRecord {
        name: desired_domain_name.into(),
    };
    // Do the query request
    let query_req = QueryRequest::Wasm(WasmQuery::Smart {
        contract_addr: registry_contract.into(),
        msg: to_binary(&query_msg).unwrap(),
    });
    // Get the query result
    let query_resp = deps.querier.query(&query_req)?;

    // Check the query result
    if query_resp.is_ok() {
        // The desired domain has already been taken
    }
    if query_resp.is_err() {
        // The desired domain is available or the format was invalid
    }

    Ok(Response::default())
}
```

For a valid domain, here's what the response for `ResolveRecord` looks like.

```json
{ 
  address: "archway1n7d4c52knwqqkw9j975ranknkp4fn3we0unrp6",
  expiration: 1751466900
}
```

:::info
The `expiration` returned by `ResolveRecord` is a [Unix Timestamp](https://en.wikipedia.org/wiki/Unix_time) denominated in seconds.

Note that querying `ResolveRecord` for an expired domain will return an error.
:::

## Resolving a Domain's Data

Resolve detailed domain data with the usual metadata query for `cw721` tokens (`NftInfo`) using ArchID's  [cw721 address](/docs/contracts/intro#smart-contract-addresses) and the domain (`token_id`) to request data for. 

Here's an example of how we might call the `NftInfo` entry point.

```js
use cosmwasm_std::{
    Deps, Env, to_binary, QueryRequest, Response, WasmQuery,
};
use crate::msg::SomeQueryMsg; // Your msg type

use archid_token::{Extension, Metadata, QueryMsg as Cw721QueryMsg};
use cw721_updatable::{NftInfoResponse};

pub fn some_query_fn(
    msg: SomeQueryMsg,
    deps: Deps,
    env: Env,
) -> Result<Response, ContractError> {
    let cw721 = "archway1cf5rq0amcl5m2flqrtl4gw2mdl3zdec9vlp5hfa9hgxlwnmrlazsdycu4l";
    let token_id = "archid.arch";

    // Create the query msg
    let query_msg: archid_token::QueryMsg<Extension> = Cw721QueryMsg::NftInfo {
        token_id: token_id.into(),
    };
    // Do the query request
    let req = QueryRequest::Wasm(WasmQuery::Smart {
        contract_addr: cw721.into(),
        msg: to_binary(&query_msg).unwrap(),
    });
    // Get the query result
    let query_result: NftInfoResponse<Metadata> = deps.querier.query(&req)?;
    
    // Do something with query_result

    Ok(Response::default())
}
```

This is what the value of `query_result` in the above example could look like for a valid `token_id`.

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