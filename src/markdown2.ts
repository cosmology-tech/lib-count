import { MergedPackageData } from "./types";

const fs = require('fs');
const path = require('path');

export function generateMarkdownTable2(data: MergedPackageData) {
    let markdown = '';
    const categories = {};

    // Group packages by category
    for (const [packageName, { category, weekly, monthly, total }] of Object.entries(data)) {
        if (!categories[category]) {
            categories[category] = {
                packages: []
            };
        }
        // Add package details to the category
        categories[category].packages.push({ packageName, weekly, monthly, total });
    }

    // Generate markdown for each category
    for (const [category, { packages }] of Object.entries(categories)) {
        markdown += `### ${category}\n\n`;
        markdown += '| Name | Total | Monthly | Weekly |\n';
        markdown += '| ------- | ------ | ------- | ----- |\n';

        const totalCounts = {
            monthly: 0,
            weekly: 0,
            total: 0
        };

        for (const { weekly, monthly, total } of packages) {
            totalCounts.weekly += weekly;
            totalCounts.total += total;
            totalCounts.monthly += monthly;
        }
        markdown += `| *Total* | ${formatNumber(totalCounts.total)} | ${formatNumber(totalCounts.monthly)} | ${formatNumber(totalCounts.weekly)} |\n`;
        for (const { packageName, weekly, monthly, total } of packages) {
            markdown += `| ${packageName} | ${formatNumber(total)} | ${formatNumber(monthly)} | ${formatNumber(weekly)} |\n`;
        }

        markdown += '\n'; // Add an extra newline for spacing between categories
    }

    return markdown;
}

function formatNumber(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
