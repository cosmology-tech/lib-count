// import { resolve } from 'path';
// import { packages } from "./packages";
// import {
//     saveDownloadCountsByCategory,
//     getTotalPeriod,
//     getWeeklyPeriod,
//     getMonthlyPeriod
// } from "./downloads";
// import { generateMarkdownTable, saveMarkdown } from './markdown';

// async function processDownloads(periodFunction, jsonFilePath, markdownFilePath) {
//     const period = periodFunction();
//     const downloadData = await saveDownloadCountsByCategory(packages, period, jsonFilePath);
//     const markdownContent = generateMarkdownTable(downloadData);
//     saveMarkdown(markdownFilePath, markdownContent);
//     return downloadData;
// }

// const main = async () => {
//     const basePath = resolve(__dirname, '../output');
//     const periods = [
//         { name: 'total', periodFunction: getTotalPeriod, jsonFileName: 'total_downloads.json', markdownFileName: 'total_downloads.md' },
//         { name: 'weekly', periodFunction: getWeeklyPeriod, jsonFileName: 'weekly_downloads.json', markdownFileName: 'weekly_downloads.md' },
//         { name: 'monthly', periodFunction: getMonthlyPeriod, jsonFileName: 'monthly_downloads.json', markdownFileName: 'monthly_downloads.md' },
//     ];

//     const periodOutput = {}
//     for (const { name, periodFunction, jsonFileName, markdownFileName } of periods) {
//         const jsonFilePath = resolve(basePath, jsonFileName);
//         const markdownFilePath = resolve(basePath, markdownFileName);
//         const data = await processDownloads(periodFunction, jsonFilePath, markdownFilePath);
//         periodFunction[name] = data;
//     }


// };

// main();


import { resolve } from 'path';
import { writeFileSync } from 'fs';
import { parse } from 'json2csv';
import { packages } from "./packages";
import {
    mergeDownloadsData // Make sure this is exported from wherever it's defined
} from "./csv";
import {
    saveDownloadCountsByCategory,
    getTotalPeriod,
    getWeeklyPeriod,
    getMonthlyPeriod,
} from "./downloads";

async function processDownloads(periodFunction, jsonFilePath) {
    const period = periodFunction();
    return await saveDownloadCountsByCategory(packages, period, jsonFilePath);
}

const main = async () => {
    const basePath = resolve(__dirname, '../output');
    const periods = [
        { periodFunction: getTotalPeriod, jsonFileName: 'total_downloads.json', periodName: 'total' },
        { periodFunction: getWeeklyPeriod, jsonFileName: 'weekly_downloads.json', periodName: 'weekly' },
        { periodFunction: getMonthlyPeriod, jsonFileName: 'monthly_downloads.json', periodName: 'monthly' },
    ];

    let downloadsDataCollection = {
        total: {},
        weekly: {},
        monthly: {}
    };

    for (const { periodFunction, jsonFileName, periodName } of periods) {
        const jsonFilePath = resolve(basePath, jsonFileName);
        downloadsDataCollection[periodName] = await processDownloads(periodFunction, jsonFilePath);
    }

    // Merge all periods into a single data structure
    const mergedData = mergeDownloadsData(
        downloadsDataCollection.total,
        downloadsDataCollection.weekly,
        downloadsDataCollection.monthly
    );

    // Generate CSV
    const csvOutputPath = resolve(basePath, 'downloads_summary.csv');
    const csvData = Object.entries(mergedData).map(([packageName, data]) => ({
        packageName,
        category: data.category,
        totalDownloads: data.total,
        weeklyDownloads: data.weekly,
        monthlyDownloads: data.monthly,
    }));
    const csv = parse(csvData, ['packageName', 'category', 'totalDownloads', 'weeklyDownloads', 'monthlyDownloads']);
    writeFileSync(csvOutputPath, csv);
    console.log(`CSV saved to: ${csvOutputPath}`);
};

main();
