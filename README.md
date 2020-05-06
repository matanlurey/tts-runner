# tts-runner

Node.js library for running [Tabletop Simulator][1].

[1]: https://store.steampowered.com/app/286160/Tabletop_Simulator/

## API

### `launch(options)`

```ts
{
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
```

### `const instance = await launch()`

```ts
{
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
  kill;
}
```
