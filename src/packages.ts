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
    "cosmos-kit-wallets": [
        '@cosmos-kit/frontier-extension',
        '@cosmos-kit/ledger',
        '@cosmos-kit/cosmos-extension-metamask',
        '@cosmos-kit/fin',
        '@cosmos-kit/coin98-extension',
        '@cosmos-kit/okxwallet-extension',
        '@cosmos-kit/trust-mobile',
        '@cosmos-kit/shell',
        '@cosmos-kit/leap-capsule-social-login',
        '@cosmos-kit/cosmostation-extension',
        '@cosmos-kit/vectis',
        '@cosmos-kit/fin-extension',
        '@cosmos-kit/ninji',
        '@cosmos-kit/station-extension',
        '@cosmos-kit/coin98',
        '@cosmos-kit/leap-extension',
        '@cosmos-kit/exodus',
        '@cosmos-kit/trust-extension',
        '@cosmos-kit/leap',
        '@cosmos-kit/xdefi',
        '@cosmos-kit/web3auth',
        '@cosmos-kit/initia-extension',
        '@cosmos-kit/cosmostation',
        '@cosmos-kit/shell-extension',
        '@cosmos-kit/cosmostation-mobile',
        '@cosmos-kit/vectis-extension',
        '@cosmos-kit/station',
        '@cosmos-kit/exodus-extension',
        '@cosmos-kit/leap-mobile',
        '@cosmos-kit/initia',
        '@cosmos-kit/frontier',
        '@cosmos-kit/trust',
        '@cosmos-kit/compass',
        '@cosmos-kit/keplr-mobile',
        '@cosmos-kit/keplr-extension',
        '@cosmos-kit/ninji-extension',
        '@cosmos-kit/compass-extension',
        '@cosmos-kit/xdefi-extension',
        '@cosmos-kit/okxwallet',
        '@cosmos-kit/omni',
        '@cosmos-kit/keplr',
        '@cosmos-kit/omni-mobile',
        '@cosmos-kit/leap-metamask-cosmos-snap',
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
        'create-cosmos-app',
        'interchain',
        'interchain-query',
        'create-cosmos-app',
    ],
    "launchql": [
        // 'graphile-query',
        // '@launchql/graphile-settings',
        // '@launchql/graphile-testing',
        // 'pg-ast',
        // '@launchql/cli',
        // '@launchql/server',
        'libpg-query',
        'pgsql-parser',
        'pgsql-enums',
        'pgsql-deparser'
    ],
    "protobufs": [
        '@protobufs/cosmos', '@protobufs/google', '@protobufs/gogoproto', '@protobufs/cosmwasm',
        '@protobufs/tendermint', '@protobufs/ibc', '@protobufs/cosmos_proto', '@protobufs/osmosis',
        '@protobufs/secret', '@protobufs/juno', '@protobufs/akash', '@protobufs/regen',
        '@protobufs/pylons', '@protobufs/stargaze', '@protobufs/bcna', '@protobufs/comdex',
        '@protobufs/evmos', '@protobufs/axelar', '@protobufs/amino'
    ]
};