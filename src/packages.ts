import { Packages } from "./types";

// Structured as categories with their respective packages
export const packages: Packages = {
    "cosmos-kit": [
        'cosmos-kit',
        '@cosmos-kit/core',
        '@cosmos-kit/react',
        '@cosmos-kit/react-lite',
        '@cosmos-kit/walletconnect'
    ],
    "cosmwasm": ['@cosmwasm/ts-codegen'],
    "interchain-ui": [
        '@interchain-ui/react'
    ],
    "telescope": [
        '@cosmology/telescope',
        '@cosmology/lcd',
        '@cosmology/ast',
        '@osmonauts/telescope',
        '@osmonauts/lcd',
        '@osmonauts/ast'
    ],
    "dydx": ['@dydxprotocol/v4-client-js'],
    "stargaze": [
        'stargazejs',
        '@stargaze-zone/chain',
        '@stargaze-zone/contracts',
        'stargaze-query'
    ],
    "stride": ['stridejs'],
    "quicksilver": ['quicksilverjs'],
    "juno": [
        'juno-network',
        '@juno-network/assets'
    ],
    "osmosis": ['@osmonauts/math', 'osmojs'],
    "chain-registry": [
        '@chain-registry/client',
        '@chain-registry/types',
        '@chain-registry/keplr',
        '@chain-registry/cosmostation',
        '@chain-registry/osmosis',
        '@chain-registry/juno',
        '@chain-registry/assets',
        '@chain-registry/utils',
        'chain-registry'
    ],
    "cosmology": [
        '@cosmology/cli',
        '@cosmology/core',
        'cosmology',
        'create-cosmos-app'
    ],
    "launchql": [
        'graphile-query',
        '@launchql/graphile-settings',
        '@launchql/graphile-testing',
        'pg-ast',
        '@launchql/cli',
        '@launchql/server',
        'libpg-query',
        'pgsql-parser'
    ],
    "protobufs": [
        '@protobufs/cosmos', '@protobufs/google', '@protobufs/gogoproto', '@protobufs/cosmwasm',
        '@protobufs/tendermint', '@protobufs/ibc', '@protobufs/cosmos_proto', '@protobufs/osmosis',
        '@protobufs/secret', '@protobufs/juno', '@protobufs/akash', '@protobufs/regen',
        '@protobufs/pylons', '@protobufs/stargaze', '@protobufs/bcna', '@protobufs/comdex',
        '@protobufs/evmos', '@protobufs/axelar', '@protobufs/amino'
    ]
};