// INPUT
export type Packages = {
    [categoryName: string]: string[];
};

// OUTPUT
export type PackageDownloads = {
    [packageName: string]: number;
};

export type CategoryData = {
    total: number;
    packages: PackageDownloads;
};

export type DownloadsData = {
    [categoryName: string]: CategoryData;
};

