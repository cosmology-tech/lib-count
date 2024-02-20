import { DownloadsData, MergedPackageData } from "./types";
import { writeFileSync } from 'fs';
import { parse } from 'json2csv';
import { getNow } from "./downloads";

export function mergeDownloadsData(totalDownloadsData, weeklyDownloadsData, monthlyDownloadsData) {
    let mergedData: MergedPackageData = {};

    // A helper function to merge individual DownloadsData into mergedData
    function mergePeriodData(downloadsData: DownloadsData, period: 'total' | 'weekly' | 'monthly') {
        Object.entries(downloadsData).forEach(([categoryName, categoryData]) => {
            Object.entries(categoryData.packages).forEach(([packageName, downloads]) => {
                if (!mergedData[packageName]) {
                    mergedData[packageName] = { category: categoryName, total: 0, weekly: 0, monthly: 0, timestamp: getNow() };
                }
                mergedData[packageName][period] = downloads;
            });
        });
    }

    mergePeriodData(totalDownloadsData, 'total');
    mergePeriodData(weeklyDownloadsData, 'weekly');
    mergePeriodData(monthlyDownloadsData, 'monthly');

    return mergedData;
}

export async function generatePackageDownloadsCSV(packagesData: MergedPackageData, outputPath) {
    const rows = Object.entries(packagesData).map(([name, data]) => ({
        name,
        category: data.category,
        total: data.total,
        weekly: data.weekly,
        monthly: data.monthly,
        timestamp: data.timestamp,
    }));


    try {
        const csv = parse(rows, { fields: ["name", "category", "total", "weekly", "monthly", "timestamp"] });
        writeFileSync(outputPath, csv, 'utf8');
        console.log(`CSV saved to: ${outputPath}`);
    } catch (err) {
        console.error('Error generating CSV:', err);
    }
}
