---
id: reverse-lookups
sidebar_position: 4
title: Reverse Lookups
---

In web2, [reverse DNS lookup](https://en.wikipedia.org/wiki/Reverse_DNS_lookup) or reverse DNS resolution (rDNS), is a querying technique of the Domain Name System (DNS) to determine the domain name associated with an IP address. 

For web3 dapps, like [ArchID](https://archid.app) reverse lookup is a query that uses an [Archway](https://archway.io) address to return a list of non-expired ArchID domains that resolve to it. 

Reverse lookups are handled by the `ResolveAddress` query entry point. `ResolveAddress` takes a parameter (`address`) as an argument.

Here's an example of how we might query the `ResolveAddress` entry point.

```js
const REGISTRY_CONTRACT = "archway1275jwjpktae4y4y0cdq274a2m0jnpekhttnfuljm6n59wnpyd62qppqxq0";

async function resolveAddress(address = null) {
  if (!address) return;
  let client = await getClient();
  try {
    let entrypoint = {
      resolve_address: {
        address: address
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

Here's what the response for `ResolveAddress` looks like for an address that has one, or more, domains resolving to it.

```json
{ "names": [ "archid.arch" ] }
```

If no domains resolve to the queried address, `ResolveAddress` responds with an empty array.

```json
{ "names": [] }
```

:::tip
`ResolveAddress` is useful for builders to identify their users and show personalized profiles. See the [Name Resolution](/docs/dapps/resolution) doc for information about showing avatars, and user customized domain data.
:::