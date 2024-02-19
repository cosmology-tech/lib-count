import { resolve } from 'path';
import { packages } from "./packages";
import {
    saveDownloadCountsByCategory,
    getTotalPeriod,
    getWeeklyPeriod,
    getMonthlyPeriod
} from "./downloads";
import { generateMarkdownTable, saveMarkdown } from './markdown';

async function processDownloads(periodFunction, jsonFilePath, markdownFilePath) {
    const period = periodFunction();
    const downloadData = await saveDownloadCountsByCategory(packages, period, jsonFilePath);
    const markdownContent = generateMarkdownTable(downloadData);
    saveMarkdown(markdownFilePath, markdownContent);
}

const main = async () => {
    const basePath = resolve(__dirname, '../output');
    const periods = [
        { periodFunction: getTotalPeriod, jsonFileName: 'total_downloads.json', markdownFileName: 'total_downloads.md' },
        { periodFunction: getWeeklyPeriod, jsonFileName: 'weekly_downloads.json', markdownFileName: 'weekly_downloads.md' },
        { periodFunction: getMonthlyPeriod, jsonFileName: 'monthly_downloads.json', markdownFileName: 'monthly_downloads.md' },
    ];

    for (const { periodFunction, jsonFileName, markdownFileName } of periods) {
        const jsonFilePath = resolve(basePath, jsonFileName);
        const markdownFilePath = resolve(basePath, markdownFileName);
        await processDownloads(periodFunction, jsonFilePath, markdownFilePath);
    }
};

main();
