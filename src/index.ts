const fs = require('fs');
const path = require('path');
const fetch = require('isomorphic-fetch');

const packages = [
    'osmojs',
    'chain-registry',
    '@chain-registry/client',
    'create-cosmos-app',
    '@interchain-ui/react',
    '@cosmology/telescope',
    '@osmonauts/telescope',
    '@cosmwasm/ts-codegen',
    '@cosmos-kit/core',
    '@cosmos-kit/react',
    'cosmos-kit'
];

// const period = 'last-month';
const period = '2005-01-01:2024-01-19';

const API_ENDPOINT = 'https://api.npmjs.org/downloads/point';
const outputPathRelative = '../downloads.json';

const outputPath = path.resolve(__dirname, outputPathRelative);

const fetchPromises = packages.map((packageName) => {
    const API = `${API_ENDPOINT}/${period}/${packageName}`;
    return fetch(API).then((response) => response.json());
});

const fetchDownloadCount = async () => {
    try {
        const data = await Promise.all(fetchPromises);

        const formattedData = data.reduce((acc, curr, index) => {
            acc[packages[index]] = curr.downloads;
            return acc;
        }, {});

        const jsonData = JSON.stringify(formattedData, null, 2);

        fs.writeFileSync(outputPath, jsonData);

        console.log('Downloads saved to:', outputPath);
    } catch (error) {
        console.error('Error:', error);
    }
};

fetchDownloadCount();
