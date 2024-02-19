import { MergedPackageData } from "./types";
import { writeFileSync } from 'fs';
import { parse } from 'json2csv';

export function mergeDownloadsData(totalDownloadsData, weeklyDownloadsData, monthlyDownloadsData) {
    let mergedData: MergedPackageData = {};

    // A helper function to merge individual DownloadsData into mergedData
    function mergePeriodData(downloadsData, period: 'total' | 'weekly' | 'monthly') {
        Object.entries(downloadsData).forEach(([categoryName, categoryData]) => {
            Object.entries(categoryData.packages).forEach(([packageName, downloads]) => {
                if (!mergedData[packageName]) {
                    mergedData[packageName] = { category: categoryName, total: 0, weekly: 0, monthly: 0 };
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
    // Assuming packagesData is an object like { packageName: { category: '', total: 0, weekly: 0, monthly: 0 }}
    const rows = Object.entries(packagesData).map(([packageName, data]) => ({
        packageName,
        category: data.category,
        totalDownloads: data.total,
        weeklyDownloads: data.weekly,
        monthlyDownloads: data.monthly,
    }));

    try {
        const csv = parse(rows, { fields: ["packageName", "category", "totalDownloads", "weeklyDownloads", "monthlyDownloads"] });
        writeFileSync(outputPath, csv, 'utf8');
        console.log(`CSV saved to: ${outputPath}`);
    } catch (err) {
        console.error('Error generating CSV:', err);
    }
}