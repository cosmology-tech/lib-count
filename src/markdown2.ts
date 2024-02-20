import { MergedPackageData } from "./types";

const fs = require('fs');
const path = require('path');

export function generateReadme(data: MergedPackageData) {
    let markdown = `
# Web, Inc's Software Download Count Repository

Welcome to the official repository for tracking the download counts of Web, Inc's software. This repository provides detailed statistics on the downloads, helping users and developers gain insights into the usage and popularity of our products.

## Overview

This repository contains detailed download statistics for all Web, Inc's software products. It is updated regularly to reflect the latest download counts, with intervals ending at the current time that the snapshot was taken.

## CSV files

- [Downloads Summary CSV](output/downloads_summary.csv): A comprehensive CSV file containing summary statistics for each software product, including total downloads, monthly downloads, and trends. The data reflects the most recent snapshot, with intervals ending at the snapshot's current time.
- [Historical Snapshots](output/historical): History of the summary CSV files for each snapshot.

`
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

    // Table of Contents
    markdown += '## Table of Contents\n';
    for (const category of Object.keys(categories)) {
        markdown += `- [${category}](#${category.toLowerCase().replace(/\s+/g, '-')})\n`;
    }
    markdown += '\n';

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
            markdown += `| [${packageName}](https://www.npmjs.com/package/${packageName}) | ${formatNumber(total)} | ${formatNumber(monthly)} | ${formatNumber(weekly)} |\n`;
        }

        markdown += '\n'; // Add an extra newline for spacing between categories
    }

    return markdown;
}

function formatNumber(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
