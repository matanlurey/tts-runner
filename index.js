"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.launch = void 0;
const child_process_1 = require("child_process");
const fs_extra_1 = __importDefault(require("fs-extra"));
const steamFinder = __importStar(require("./steam_finder"));
class Launcher {
    constructor(options = {}, overrides = {}) {
        // Configuration.
        this.steamAppsPath = options.steamAppsPath;
        if (options.ignoreDefaultFlags) {
            this.flags = [];
        }
        else {
            this.flags = ['-novid', '-nosubscription'];
        }
        if (options.additionalFlags) {
            this.flags = [...this.flags, ...options.additionalFlags];
        }
        // Overrides for testing.
        this.cpSpawn = overrides.cpSpawn || child_process_1.spawn;
        this.fsAccessSync = overrides.fsAccessSync || fs_extra_1.default.accessSync;
        this.psGetPlatform = overrides.psGetPlatform || Launcher.defaultGetPlatform;
        this.psEnvironment = overrides.psEnvironment || process.env;
    }
    static findInstalls(accessSync, getPlatform, environment) {
        const platform = getPlatform();
        switch (platform) {
            case 'darwin':
            case 'linux':
            case 'win32':
                return steamFinder.binary[platform](accessSync, environment);
            default:
                throw new Error(`Unsupported Platform: ${platform}.`);
        }
    }
    static defaultGetPlatform() {
        return process.platform;
    }
    launch() {
        return __awaiter(this, void 0, void 0, function* () {
            let execPath = this.steamAppsPath;
            if (!execPath) {
                const installs = Launcher.findInstalls(this.fsAccessSync, this.psGetPlatform, this.psEnvironment);
                if (!installs.length) {
                    throw new Error('No Steam installations found.');
                }
                execPath = installs[0];
            }
            const instance = (this.runningProcess = this.cpSpawn(execPath, this.flags, {
                detached: true,
            }));
            return {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                pid: instance.pid,
                process: instance,
                kill: this.kill.bind(this),
            };
        });
    }
    kill() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.runningProcess) === null || _a === void 0 ? void 0 : _a.kill();
        });
    }
}
/**
 * Launches a new instance of Tabletop Simulator.
 */
function launch(options = {}, overrides = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Launcher(options, overrides).launch();
    });
}
exports.launch = launch;
