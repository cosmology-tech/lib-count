import { Packages } from "./types";

// Structured as categories with their respective packages
export const packages: Packages = {
    "cosmos-kit": ['@cosmos-kit/core', '@cosmos-kit/react'],
    "cosmwasm": ['@cosmwasm/ts-codegen'],
    "interchain UI": ['@interchain-ui/react'],
    "telescope": ['@cosmology/telescope', '@osmonauts/telescope'],
    "osmosis": ['@osmonauts/math', 'osmojs'],
    "cosmology": [
        '@chain-registry/client', '@chain-registry/types', '@chain-registry/utils',
        '@cosmology/cli', 'chain-registry', 'cosmology', 'cosmos-kit', 'create-cosmos-app'
    ],
    "launchql": ['@launchql/cli', 'libpg-query', 'pgsql-parser'],
    "protobufs": [
        '@protobufs/cosmos', '@protobufs/google', '@protobufs/gogoproto', '@protobufs/cosmwasm',
        '@protobufs/tendermint', '@protobufs/ibc', '@protobufs/cosmos_proto', '@protobufs/osmosis',
        '@protobufs/secret', '@protobufs/juno', '@protobufs/akash', '@protobufs/regen',
        '@protobufs/pylons', '@protobufs/stargaze', '@protobufs/bcna', '@protobufs/comdex',
        '@protobufs/evmos', '@protobufs/axelar', '@protobufs/amino'
    ]
};