import { MergedPackageData } from "./types";

const fs = require('fs');
const path = require('path');

export function generateReadme(data: MergedPackageData) {
    let header = `
# Web, Inc.

<p align="center">
    <img src="https://github.com/cosmology-tech/lib-count/assets/545047/8b9b2996-a9cc-48c8-9bce-311dbd5b55a9" alt="webincubator" width="120">
</p>

### Software Download Count Repository

Welcome to the official repository for tracking the download counts of Web, Inc's software. This repository provides detailed statistics on the downloads, helping users and developers gain insights into the usage and popularity of our products.

**the Web:** At the heart of our mission is the synergy between the mature, user-friendly ecosystem of Web2 and the decentralized, secure potential of Web3. We're here to bridge this gap, unlocking real-world applications and the full potential of technology, making the web whole again.

### Our Projects:
- **[Cosmology](https://github.com/cosmology-tech):** Build in the interchain.
- **[LaunchQL](https://github.com/launchql):** Simplify database management.

Join us in shaping the future of the web.

## Overview

This repository contains detailed download statistics for all Web, Inc's software products. It is updated regularly to reflect the latest download counts, with intervals ending at the current time that the snapshot was taken.

## CSV files

- [Downloads Summary CSV](output/downloads_summary.csv): A comprehensive CSV file containing summary statistics for each package, including total, monthly, and weekly downloads. The data reflects the most recent snapshot, with intervals ending at the snapshot's current time.
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

    let markdown = '';

    // Table of Contents
    markdown += '## Table of Contents\n';
    for (const category of Object.keys(categories)) {
        markdown += `- [${category}](#${category.toLowerCase().replace(/\s+/g, '-')})\n`;
    }
    markdown += '\n';

    const grandTotals = {
        monthly: 0,
        weekly: 0,
        total: 0
    };

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
            grandTotals.weekly += weekly;
            grandTotals.total += total;
            grandTotals.monthly += monthly;
        }
        markdown += `| *Total* | ${formatNumber(totalCounts.total)} | ${formatNumber(totalCounts.monthly)} | ${formatNumber(totalCounts.weekly)} |\n`;
        for (const { packageName, weekly, monthly, total } of packages) {
            markdown += `| [${packageName}](https://www.npmjs.com/package/${packageName}) | ${formatNumber(total)} | ${formatNumber(monthly)} | ${formatNumber(weekly)} |\n`;
        }

        markdown += '\n'; // Add an extra newline for spacing between categories
    }

    header += `### Total Downloads\n\n`;
    header += '| Name | Total | Monthly | Weekly |\n';
    header += '| ------- | ------ | ------- | ----- |\n';
    header += `| *Total* | ${formatNumber(grandTotals.total)} | ${formatNumber(grandTotals.monthly)} | ${formatNumber(grandTotals.weekly)} |\n`;

    const footer = `
## Understanding Downloads
### Interconnected Libraries
Our ecosystem comprises a wide array of libraries, most of which are included here. It's important to note that some of our npm modules are built upon each other. This interconnected nature means that when one module is downloaded as a dependency of another, both contribute to the download counts.

### Signal Strength
Download statistics serve as a robust indicator of usage and interest. Even with the layered nature of library dependencies, these numbers provide us with meaningful signals about which tools are most valuable to developers and which areas are garnering the most interest.    

### Related Projects

- **[Cosmology](https://github.com/cosmology-tech):** Build in the interchain.
- **[LaunchQL](https://github.com/launchql):** Simplify database management.

Join us in shaping the future of the web.

`

    return header + markdown + footer;
}

function formatNumber(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
