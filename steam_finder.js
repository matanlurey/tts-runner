"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
function canAccess(file, accessSync) {
    try {
        accessSync(file);
        return true;
    }
    catch (_) {
        return false;
    }
}
exports.canAccess = canAccess;
function darwinBinary() {
    throw 'Unsupported Platform: MacOS.';
}
function linuxBinary() {
    throw 'Unsupported Platform: Linux.';
}
function win32Binary(accessSync, envDict) {
    const installs = [];
    const suffixes = [
        path_1.default.join('Steam', 'steamapps', 'common', 'Tabletop Simulator', 'Tabletop Simulator.exe'),
    ];
    const prefixes = [envDict.PROGRAMFILES, envDict['PROGRAMFILES(X86)']].filter((e) => e);
    prefixes.forEach((prefix) => suffixes.forEach((suffix) => {
        const appPath = path_1.default.join(prefix, suffix);
        if (canAccess(appPath, accessSync)) {
            installs.push(appPath);
        }
    }));
    return installs;
}
exports.binary = {
    win32: win32Binary,
    darwin: darwinBinary,
    linux: linuxBinary,
};
function darwinHome() {
    throw 'Unsupported Platform: MacOS.';
}
function linuxHome() {
    throw 'Unsupported Platform: Linux.';
}
function win32Home(envDict) {
    const userProfile = envDict.USERPROFILE;
    if (!userProfile) {
        throw 'Could not find home directory.';
    }
    return path_1.default.join(userProfile, 'Documents', 'My Games', 'Tabletop Simulator');
}
exports.homeDir = {
    win32: win32Home,
    dartwin: darwinHome,
    linux: linuxHome,
};
