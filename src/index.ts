const fs = require('fs');
const path = require('path');
const fetch = require('isomorphic-fetch');

const packages = [

    // cosmos-kit
    '@cosmos-kit/core',
    '@cosmos-kit/react',

    // cosmwasm
    '@cosmwasm/ts-codegen',

    // interchain UI
    '@interchain-ui/react',

    // telescope
    '@cosmology/telescope',
    '@osmonauts/telescope',

    // osmosis
    '@osmonauts/math',
    'osmojs',

    // cosmology 
    '@chain-registry/client',
    '@chain-registry/types',
    '@chain-registry/utils',
    '@cosmology/cli',
    'chain-registry',
    'cosmology',
    'cosmos-kit',
    'create-cosmos-app',

    // launchql
    '@launchql/cli',
    'libpg-query',
    'pgsql-parser',

    // protobufs
    '@protobufs/cosmos',
    '@protobufs/google',
    '@protobufs/gogoproto',
    '@protobufs/cosmwasm',
    '@protobufs/tendermint',
    '@protobufs/ibc',
    '@protobufs/cosmos_proto',
    '@protobufs/osmosis',
    '@protobufs/secret',
    '@protobufs/juno',
    '@protobufs/akash',
    '@protobufs/regen',
    '@protobufs/pylons',
    '@protobufs/stargaze',
    '@protobufs/bcna',
    '@protobufs/comdex',
    '@protobufs/evmos',
    '@protobufs/axelar',
    '@protobufs/amino'
];



const API_ENDPOINT = 'https://api.npmjs.org/downloads/point';
const totalDownloadsOutputPath = path.resolve(__dirname, '../total_downloads.json');
const weeklyDownloadsOutputPath = path.resolve(__dirname, '../weekly_downloads.json');

// Function to format date as YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Function to calculate totalPeriod dynamically
function getTotalPeriod() {
    const startDate = '2020-03-31'; // Fixed start date
    const endDate = formatDate(new Date()); // Today's date
    return `${startDate}:${endDate}`;
}

// Function to calculate weeklyPeriod dynamically
function getWeeklyPeriod() {
    const today = new Date();
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const startDate = formatDate(lastWeek);
    const endDate = formatDate(today);
    return `${startDate}:${endDate}`;
}

async function fetchDownloadCounts(packageName, period) {
    const url = `${API_ENDPOINT}/${period}/${packageName}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return { packageName, downloads: data.downloads };
    } catch (error) {
        console.error('Error fetching data for', packageName, error);
        return { packageName, downloads: 0 };
    }
}

async function saveDownloadCounts(period, outputPath) {
    const fetchPromises = packages.map(packageName => fetchDownloadCounts(packageName, period));

    try {
        const results = await Promise.all(fetchPromises);
        const formattedData = results.reduce((acc, { packageName, downloads }) => {
            acc[packageName] = downloads;
            return acc;
        }, {});

        fs.writeFileSync(outputPath, JSON.stringify(formattedData, null, 2));
        console.log('Downloads saved to:', outputPath);
    } catch (error) {
        console.error('Error:', error);
    }
}

const totalPeriod = getTotalPeriod();
const weeklyPeriod = getWeeklyPeriod();

saveDownloadCounts(totalPeriod, totalDownloadsOutputPath);
saveDownloadCounts(weeklyPeriod, weeklyDownloadsOutputPath);
