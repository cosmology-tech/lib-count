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

// merged

export type MergedPackageData = {
    [packageName: string]: {
        category: string;
        total: number;
        weekly: number;
        monthly: number;
        timestamp: number;
    };
};