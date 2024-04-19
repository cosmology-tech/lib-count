import { mkdirp } from "mkdirp";
import { generateMarkdownTable } from "./markdown";
import { DownloadsData } from "./types";
import { resolve, dirname } from 'path';

const fs = require('fs');
const fetch = require('isomorphic-fetch');

const API_ENDPOINT = 'https://api.npmjs.org/downloads/point';

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

export function getTotalPeriod() {
    const startDate = '2020-03-31';
    const endDate = formatDate(new Date());
    return `${startDate}:${endDate}`;
}

export function getNow() {
    return formatDate(new Date());
}

export function getWeeklyPeriod() {
    const today = new Date();
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const startDate = formatDate(lastWeek);
    const endDate = formatDate(today);
    return `${startDate}:${endDate}`;
}

export function getMonthlyPeriod() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Setting day as 0 goes to the last day of the previous month

    const startDate = formatDate(firstDayOfMonth);
    const endDate = formatDate(lastDayOfMonth);
    return `${startDate}:${endDate}`;
}

export async function fetchDownloadCounts(packageName, period) {
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

export async function saveDownloadCountsByCategoryForPeriod
    (packages, periodFunction, periodName, basePath): Promise<DownloadsData> {
    const categoryData = {};
    const period = periodFunction();

    for (const category of Object.keys(packages)) {
        console.log(`Fetching download counts for ${category}...`);
        const fetchPromises = packages[category].map(packageName => fetchDownloadCounts(packageName, period));

        try {
            const results = await Promise.all(fetchPromises);
            const totalDownloads = results.reduce((acc, { downloads }) => acc + downloads, 0);
            const packageDetails = results.reduce((acc, { packageName, downloads }) => {
                acc[packageName] = downloads;
                return acc;
            }, {});

            // Store category data with total and individual package downloads
            categoryData[category] = {
                total: totalDownloads,
                packages: packageDetails
            };
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const outputPath = resolve(basePath, periodName + '_downloads.json');
    const outputPathDated = resolve(basePath, `historical/${periodName}_downloads_${getNow()}.json`);

    mkdirp.sync(dirname(outputPathDated));
    // Write all categories data to the file at once
    fs.writeFileSync(outputPath, JSON.stringify(categoryData, null, 2));
    fs.writeFileSync(outputPathDated, JSON.stringify(categoryData, null, 2));
    console.log(`Download counts saved to:`, outputPath);
    console.log(`Download counts saved to:`, outputPathDated);

    const markdownContent = generateMarkdownTable(categoryData);
    const markdownFilePath = resolve(basePath, `${periodName}_downloads.md`);
    fs.writeFileSync(markdownFilePath, markdownContent, 'utf8');
    console.log(`Markdown saved to: ${markdownFilePath}`);


    return categoryData;
}
