import { DownloadsData } from "./types";

const fs = require('fs');
const path = require('path');

export function generateMarkdownTable(data: DownloadsData) {
    let markdown = '';

    for (const [category, { total, packages }] of Object.entries(data)) {
        markdown += `### ${category}\n`;
        markdown += `Total Downloads: ${formatNumber(total)}\n\n`;
        markdown += '| Package | Downloads |\n';
        markdown += '| ------- | --------- |\n';

        for (const [packageName, downloadCount] of Object.entries(packages)) {
            markdown += `| ${packageName} | ${formatNumber(downloadCount)} |\n`;
        }

        markdown += '\n'; // Add an extra newline for spacing between categories
    }

    return markdown;
}

export function saveMarkdown(outputPath, markdownContent) {
    fs.writeFileSync(outputPath, markdownContent, 'utf8');
    console.log(`Markdown saved to: ${outputPath}`);
}


function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
