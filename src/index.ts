import { resolve, dirname } from 'path';
import { packages } from "./packages";
import { writeFileSync } from "fs";
import {
    generatePackageDownloadsCSV,
    mergeDownloadsData // Make sure this is exported from wherever it's defined
} from "./csv";
import {
    saveDownloadCountsByCategoryForPeriod,
    getTotalPeriod,
    getWeeklyPeriod,
    getMonthlyPeriod,
    getNow,
} from "./downloads";
import { mkdirp } from 'mkdirp';
import { generateMarkdownTable2 } from './markdown2';

const main = async () => {
    const basePath = resolve(__dirname, '../output');
    const periods = [
        { periodFunction: getTotalPeriod, periodName: 'total' },
        { periodFunction: getWeeklyPeriod, periodName: 'weekly' },
        { periodFunction: getMonthlyPeriod, periodName: 'monthly' },
    ];

    let downloadsDataCollection = {
        total: {},
        weekly: {},
        monthly: {}
    };

    for (const { periodFunction, periodName } of periods) {
        downloadsDataCollection[periodName] = await saveDownloadCountsByCategoryForPeriod(packages, periodFunction, periodName, basePath);
    }

    // Merge all periods into a single data structure
    const mergedData = mergeDownloadsData(
        downloadsDataCollection.total,
        downloadsDataCollection.weekly,
        downloadsDataCollection.monthly
    );

    // Generate CSV
    const csvOutputPath = resolve(basePath, 'downloads_summary.csv');
    const csvOutputPathDated = resolve(basePath, `historical/downloads_summary_${getNow()}.csv`);
    mkdirp.sync(dirname(csvOutputPathDated));

    const markdownFilePath = resolve(basePath, 'downloads_summary.md');
    const markdown = generateMarkdownTable2(mergedData);
    writeFileSync(markdownFilePath, markdown);

    generatePackageDownloadsCSV(mergedData, csvOutputPath);
    generatePackageDownloadsCSV(mergedData, csvOutputPathDated);
};

main();
