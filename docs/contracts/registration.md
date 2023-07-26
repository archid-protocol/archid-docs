---
id: cw-registration
sidebar_position: 2
title: Name Registration
---

Before registering a new domain or subdomain, it will be important to check if it's available to be registered. We can query the `ResolveRecord` entry point to check if any non-expired domain exists.

For more information about `ResolveRecord`, and name resolution in general, see [Name Resolution](/docs/contracts/cw-resolution).

## Calculating Registration Cost

Before registering the domain, it will also be important to calculate the registration cost. This amount will also dictate the length of the domain lifetime. 

Registration cost is based on the base per year price of registration. Since `base_cost` and `base_expiration` are configurable values of the ArchID Registry, they are liable to change. So it would be better to get the current price and expiry parameters, and not hard code them into your contract.

For convenience, we call the `base_expiration` amount "years", because on mainnet `base_expiration` is configured to be a duration of 1 year (denominated in seconds). Domains can be registered for 1, 2 or 3 years. Paying an amount equal to, or more than, 3x the `base_cost` will result in a registration of 3 years. Paying less than 1x the `base_cost` will cause the transaction to fail. The value of `base_cost` is denominated in `aarch` on mainnet and `aconst` on testnet.

We can get the `base_cost` and `base_expiration` by querying the `Config` entry point of the Registry contract. It doesn't take any arguments as parameters.

```js title="archid-registry/src/msg.rs"
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    // More entry points...
    // highlight-next-line
    Config {},
}
```

Here's an example of how we might call the `Config` entry point and determine the real-time cost of per year domain registration.

```js 
use cosmwasm_std::{
    Deps, Env, to_binary, QueryRequest, Response, WasmQuery,
};
use crate::msg::SomeQueryMsg; // Your custom msg type
use crate::archid_registry;

pub fn some_query_fn(
    msg: SomeQueryMsg,
    deps: Deps,
    env: Env,
) -> Result<Response, ContractError> {
    let registry_contract = "archway1275jwjpktae4y4y0cdq274a2m0jnpekhttnfuljm6n59wnpyd62qppqxq0";
    // Create the query msg
    let query_msg: archid_registry::QueryMsg = archid_registry::Config {};
    // Do the query request
    let query_req = QueryRequest::Wasm(WasmQuery::Smart {
        contract_addr: registry_contract.into(),
        msg: to_binary(&query_msg).unwrap(),
    });
    // Get the query result
    let query_resp = deps.querier.query(&query_req)?;
    // Per year cost of registration
    let cost_per_year = query_resp.base_cost.unwrap();

    // Do something with `cost_per_year` ...

    Ok(Response::default())
}
```

## Registering a Domain

To register a new domain, execute a transaction to the `Register` entry point of the ArchID Registry contract. `Register` takes 1 argument parameter (`name`). At least 1x the `base_cost` must be sent in the `funds` of the transaction.

Here's an example of how we might execute the `Register` entry point to mint a new domain name.

```js
use cosmwasm_std::{
    Coin, CosmosMsg, DepsMut, Env, MessageInfo, to_binary,
    Response, Uint128, WasmMsg,
};
use crate::msg::SomeExecuteMsg; // Your custom msg type

use archid_registry::{
  ExecuteMsg as ArchIdExecuteMsg,
};

pub fn some_execute_fn(
    msg: SomeExecuteMsg,
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
) -> Result<Response, ContractError> {
    let registry_contract = "archway1275jwjpktae4y4y0cdq274a2m0jnpekhttnfuljm6n59wnpyd62qppqxq0";
    // highlight-start
    // Do not add the `.arch` suffix when registering a domain 
    // and remember to get the actual cost per year by querying
    // the `Config` entry point
    // highlight-end
    let desired_domain_name = "archid"; 
    let cost_per_year: u128 = 1000000000000000000;
    let denom = "aarch"; // (Or "aconst" for testnet)

    // Create registration msg
    let register_msg: archid_registry::ExecuteMsg = ArchIdExecuteMsg::Register {
        name: desired_domain_name.into(),
    };
    // Do registration
    let register_resp: CosmosMsg = WasmMsg::Execute {
    contract_addr: registry_contract.into(),
    msg: to_binary(&register_msg)?,
    funds: &[Coin {
        denom: denom.into(),
        amount: Uint128::from(cost_per_year), // E.g. register for 1 year
    }],
    }
    .into();
    // Respond with registration result
    let messages = vec![register_resp];
    Ok(Response::new().add_messages(messages))
}
```

:::tip Send to a user
After successfully registering a domain from your contract. Don't forget to transfer the NFT token to a user address. This will allow them to configure their domain.
:::

## Registering a Subdomain

Registering a subdomain is not recommended for integration in external [CosmWasm](https://cosmwasm.com/) contracts. The reason is only top level domain owners can mint subdomains. ArchID domains are intended to be held and operated by humans, not contracts. Smart contracts owning top level domains would have the responsibility of re-implementing the ArchID Registry's entire functionality, otherwise domains could become stuck in a non-updatable or non-extendable state. Do-able, but a bit of a heavy lift.