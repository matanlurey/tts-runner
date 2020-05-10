export declare function canAccess(file: string, accessSync: (path: string) => void): boolean;
declare function darwinBinary(): string[];
declare function linuxBinary(): string[];
declare function win32Binary(accessSync: (path: string) => void, envDict: {
    [key: string]: string | undefined;
}): string[];
export declare const binary: {
    win32: typeof win32Binary;
    darwin: typeof darwinBinary;
    linux: typeof linuxBinary;
};
declare function darwinHome(): string;
declare function linuxHome(): string;
declare function win32Home(envDict: {
    [key: string]: string | undefined;
}): string;
export declare const homeDir: {
    win32: typeof win32Home;
    dartwin: typeof darwinHome;
    linux: typeof linuxHome;
};
export {};
