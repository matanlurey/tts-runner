import { ChildProcess, spawn } from 'child_process';
import fs from 'fs-extra';
import * as steamFinder from './steam_finder';

export interface LaunchedTTS {
  /**
   * Process ID number.
   */
  pid: number;

  /**
   * A reference to the spawned @see ChildProcess.
   */
  process: ChildProcess;

  /**
   * Kills the promise, and does any related cleanup work.
   */
  kill: () => Promise<void>;
}

export interface Options {
  /**
   * Additional flags to pass when running.
   *
   * Do note, many flags such as `-novid` and `-nosubscription` speed up start
   * times are already set by default. You can ignore this behavior by disabling
   * @see ignoreDefaultFlags.
   *
   * @see https://kb.tabletopsimulator.com/getting-started/launch-options/.
   */
  additionalFlags?: string[];

  /**
   * Whether to pass no flags by default.
   *
   * This will entirely rely on @see additionalFlags.
   */
  ignoreDefaultFlags?: boolean;

  /**
   * Explicit path of the intended Tabletop Simulator binary.
   *
   * * If this `steamAppsPath` is defined, it will be used.
   * * Otherwise, the `STEAM_APPS_PATH` env variable will be used if set.
   * * Otherwise, will attempt to detect the installed steam directory.
   */
  steamAppsPath?: string;
}

type SpawnProcess = (
  path: string,
  args: string[],
  options?: {
    detached?: boolean;
  },
) => ChildProcess;

export interface Overrides {
  cpSpawn?: SpawnProcess;
  fsAccessSync?: (path: string) => void;
  psEnvironment?: { [key: string]: string | undefined };
  psGetPlatform?: () => NodeJS.Platform;
}

class Launcher {
  static findInstalls(
    accessSync: (path: string) => void,
    getPlatform: () => NodeJS.Platform,
    environment: { [key: string]: string | undefined },
  ): string[] {
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

  private static defaultGetPlatform(): NodeJS.Platform {
    return process.platform;
  }

  private readonly flags: string[];

  private readonly cpSpawn: SpawnProcess;
  private readonly fsAccessSync: (path: string) => void;
  private readonly psGetPlatform: () => NodeJS.Platform;
  private readonly psEnvironment: { [key: string]: string | undefined };

  private steamAppsPath?: string;
  private runningProcess?: ChildProcess;

  constructor(options: Options = {}, overrides: Overrides = {}) {
    // Configuration.
    this.steamAppsPath = options.steamAppsPath;
    if (options.ignoreDefaultFlags) {
      this.flags = [];
    } else {
      this.flags = ['-novid', '-nosubscription'];
    }
    if (options.additionalFlags) {
      this.flags = [...this.flags, ...options.additionalFlags];
    }

    // Overrides for testing.
    this.cpSpawn = overrides.cpSpawn || spawn;
    this.fsAccessSync = overrides.fsAccessSync || fs.accessSync;
    this.psGetPlatform = overrides.psGetPlatform || Launcher.defaultGetPlatform;
    this.psEnvironment = overrides.psEnvironment || process.env;
  }

  async launch(): Promise<LaunchedTTS> {
    let execPath = this.steamAppsPath;
    if (!execPath) {
      const installs = Launcher.findInstalls(
        this.fsAccessSync,
        this.psGetPlatform,
        this.psEnvironment,
      );
      if (!installs.length) {
        throw new Error('No Steam installations found.');
      }
      execPath = installs[0];
    }
    const instance = (this.runningProcess = this.cpSpawn(execPath, this.flags, {
      detached: true,
    }));
    return {
      pid: instance.pid,
      process: instance,
      kill: this.kill.bind(this),
    };
  }

  private async kill(): Promise<void> {
    this.runningProcess?.kill();
  }
}

/**
 * Launches a new instance of Tabletop Simulator.
 */
export async function launch(
  options: Options = {},
  overrides: Overrides = {},
): Promise<LaunchedTTS> {
  return new Launcher(options, overrides).launch();
}
