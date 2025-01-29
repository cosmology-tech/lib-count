import { MergedPackageData } from "./types";
import { mkdirp } from "mkdirp";
import { resolve, dirname } from 'path';
import { getNow } from "./downloads";

const fs = require('fs');
const path = require('path');
const humanFormatLib = require("human-format");
const humanFormat = (num) => {
  return humanFormatLib(num, {
    maxDecimals: 1,
    separator: ''
  })
}

const makeProductCategoryBadge = (name: string, period: string, n: number, label: string = 'downloads') => {
  const basePath = resolve(__dirname, '../output');
  const outputBadge = resolve(basePath, `badges/products/${name}/${period}.json`);
  const outputNumber = resolve(basePath, `badges/products/${name}/${period}-num.json`);
  const historical = resolve(basePath, `badges/products/historical/${name}/${period}-${getNow()}.json`);
  mkdirp.sync(dirname(outputBadge));
  mkdirp.sync(dirname(historical));
  const color = '#4EC428'
  const num = humanFormat(n);
  let message;

  switch (period) {
    case 'weekly':
      message = `${num}/week`
      break;
    case 'monthly':
      message = `${num}/month`
      break;
    case 'total':
      message = `${num}`
      break;
  }

  const badge = {
    schemaVersion: 1,
    label,
    message,
    color
  };
  const pure = {
    period,
    amount: n
  };
  fs.writeFileSync(outputBadge, JSON.stringify(badge));
  fs.writeFileSync(outputNumber, JSON.stringify(pure));
  fs.writeFileSync(historical, JSON.stringify(pure));
}

export function generateReadme(data: MergedPackageData) {
  const header = `
# Interweb, Inc.
   
`;

  let body = ``;

  const categories = {};

  // Group packages by category
  for (const [packageName, { category, weekly, monthly, total }] of Object.entries(data)) {

    if (!total) continue;

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

  const hyperweb = {
    monthly: 0,
    weekly: 0,
    total: 0
  };

  const launchql = {
    monthly: 0,
    weekly: 0,
    total: 0
  };

  const utils = {
    monthly: 0,
    weekly: 0,
    total: 0
  };

  let categoryMarkdown = '';

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

      switch (category) {
        case 'utils':
          utils.weekly += weekly;
          utils.total += total;
          utils.monthly += monthly;
          break;
        case 'launchql':
          launchql.weekly += weekly;
          launchql.total += total;
          launchql.monthly += monthly;
          break;
        default:
          hyperweb.weekly += weekly;
          hyperweb.total += total;
          hyperweb.monthly += monthly;
          break;
      }
    }
    markdown += `| *Total* | ${formatNumber(totalCounts.total)} | ${formatNumber(totalCounts.monthly)} | ${formatNumber(totalCounts.weekly)} |\n`;
    // insert badge creation here
    if (totalCounts.total > 0) makeProductCategoryBadge(category, 'total', totalCounts.total);
    if (totalCounts.monthly > 0) makeProductCategoryBadge(category, 'monthly', totalCounts.monthly);
    if (totalCounts.weekly > 0) makeProductCategoryBadge(category, 'weekly', totalCounts.weekly);
    // insert badge creation here
    for (const { packageName, weekly, monthly, total } of packages) {
      markdown += `| [${packageName}](https://www.npmjs.com/package/${packageName}) | ${formatNumber(total)} | ${formatNumber(monthly)} | ${formatNumber(weekly)} |\n`;
    }

    markdown += '\n'; // Add an extra newline for spacing between categories


  }

  function addCat(obj, name) {
    categoryMarkdown += `| ${name} | ${formatNumber(obj.total)} | ${formatNumber(obj.monthly)} | ${formatNumber(obj.weekly)} |\n`;
  }

  addCat(launchql, 'Web2')
  addCat(hyperweb, 'Web3')
  addCat(utils, 'Utils')

  body += `
  
  <p align="center" width="100%">
   <img src="https://github.com/hyperweb-io/lib-count/assets/545047/c379f2e6-7fd8-436c-bd8d-5e3a3837489e" alt="webincubator" width="120"><br />
   <img height="20" src="https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fhyperweb-io%2Flib-count%2Fmain%2Foutput%2Fbadges%2Flib-count%2Ftotal_downloads.json"/>
   <img height="20" src="https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fhyperweb-io%2Flib-count%2Fmain%2Foutput%2Fbadges%2Flib-count%2Fmonthly_downloads.json"/>
   <img height="20" src="https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fhyperweb-io%2Flib-count%2Fmain%2Foutput%2Fbadges%2Flib-count%2Fweekly_downloads.json"/>
   <br>
   <img height="20" src="https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fhyperweb-io%2Flib-count%2Fmain%2Foutput%2Fbadges%2Flib-count%2Flaunchql_category.json"/>
   <img height="20" src="https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fhyperweb-io%2Flib-count%2Fmain%2Foutput%2Fbadges%2Flib-count%2Fhyperweb_category.json"/>
   <img height="20" src="https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fhyperweb-io%2Flib-count%2Fmain%2Foutput%2Fbadges%2Flib-count%2Futils_category.json"/>
  </p>

  `

  body += `### Total Downloads\n\n`;
  body += '| Name | Total | Monthly | Weekly |\n';
  body += '| ------- | ------ | ------- | ----- |\n';
  body += `| *Total* | ${formatNumber(grandTotals.total)} | ${formatNumber(grandTotals.monthly)} | ${formatNumber(grandTotals.weekly)} |\n`;
  body += categoryMarkdown;

  body += `
### Software Download Count Repository

Welcome to the official repository for tracking the download counts of Interweb, Inc.'s software. This repository provides detailed statistics on the downloads, helping users and developers gain insights into the usage and popularity of our products.

**the Web:** At the heart of our mission is the synergy between the mature, user-friendly ecosystem of Web2 and the decentralized, secure potential of Web3. We're here to bridge this gap, unlocking real-world applications and the full potential of technology, making the web whole again.

### Our Projects:
- **[Hyperweb](https://github.com/hyperweb-io):** Build interchain apps in light speed.
- **[LaunchQL](https://github.com/launchql):** Simplify database management.

Join us in shaping the future of the web.

## Overview

This repository contains detailed download statistics for all Interweb, Inc.'s software products. It is updated regularly to reflect the latest download counts, with intervals ending at the current time that the snapshot was taken.

## CSV files

- [Downloads Summary CSV](output/downloads_summary.csv): A comprehensive CSV file containing summary statistics for each package, including total, monthly, and weekly downloads. The data reflects the most recent snapshot, with intervals ending at the snapshot's current time.
- [Historical Snapshots](output/historical): History of the summary CSV files for each snapshot.
`

  // https://shields.io/badges/endpoint-badge
  const basePath = resolve(__dirname, '../output');

  const makePeriodBadge = (period: string) => {
    const outputBadge = resolve(basePath, `badges/lib-count/${period}_downloads.json`);
    mkdirp.sync(dirname(outputBadge));
    const label = 'downloads';
    const num = humanFormat(grandTotals[period]);
    let color;
    let message;
    switch (period) {
      case 'total':
        color = '#4EC428';
        message = `${num}`
        break;
      case 'monthly':
        color = '#1C7EBE';
        message = `${num}/month`
        break;
      case 'weekly':
        color = 'orange';
        message = `${num}/week`
        break;
    }

    const badge = {
      schemaVersion: 1,
      label,
      message,
      color
    };
    fs.writeFileSync(outputBadge, JSON.stringify(badge));
  }

  const makeCategoryBadge = (name: string, label: string) => {
    const outputBadge = resolve(basePath, `badges/lib-count/${name}_category.json`);
    mkdirp.sync(dirname(outputBadge));
    let num;
    let color;
    let message;
    switch (name) {
      case 'utils':
        color = '#4EC428';
        num = humanFormat(utils.total);
        message = `${num} downloads`
        break;
      case 'hyperweb':
        color = '#A96DFF';
        num = humanFormat(hyperweb.total);
        message = `${num} downloads`
        break;
      case 'launchql':
        color = '01A1FF';
        num = humanFormat(launchql.total);
        message = `${num} downloads`
        break;
    }

    const badge = {
      schemaVersion: 1,
      label,
      message,
      color
    };
    fs.writeFileSync(outputBadge, JSON.stringify(badge));
  }

  makeCategoryBadge('hyperweb', 'Web3');
  makeCategoryBadge('launchql', 'Web2');
  makeCategoryBadge('utils', 'Utilities');

  makePeriodBadge('total');
  makePeriodBadge('monthly');
  makePeriodBadge('weekly');

  const footer = `
## Understanding Downloads
### Interconnected Libraries
Our ecosystem comprises a wide array of libraries, most of which are included here. It's important to note that some of our npm modules are built upon each other. This interconnected nature means that when one module is downloaded as a dependency of another, both contribute to the download counts.

### Signal Strength
Download statistics serve as a robust indicator of usage and interest. Even with the layered nature of library dependencies, these numbers provide us with meaningful signals about which tools are most valuable to developers and which areas are garnering the most interest.    

### Related Projects

- **[Hyperweb](https://github.com/hyperweb-io):** Build interchain apps in light speed.
- **[LaunchQL](https://github.com/launchql):** Simplify database management.

Join us in shaping the future of the web.

`

  return header + body + markdown + footer;
}

function formatNumber(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


