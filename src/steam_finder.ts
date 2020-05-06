import path from 'path';

function canAccess(file: string, accessSync: (path: string) => void): boolean {
  try {
    accessSync(file);
    return true;
  } catch (_) {
    return false;
  }
}

export function darwin(): string[] {
  throw 'Unsupporetd Platform: MacOS.';
}

export function linux(): string[] {
  throw 'Unsupporetd Platform: Linux.';
}

export function win32(
  accessSync: (path: string) => void,
  envDict: { [key: string]: string | undefined },
): string[] {
  const installs: string[] = [];
  const suffixes = [
    path.join(
      'Steam',
      'steamapps',
      'common',
      'Tabletop Simulator',
      'Tabletop Simulator.exe',
    ),
  ];
  const prefixes = [envDict.PROGRAMFILES, envDict['PROGRAMFILES(X86)']].filter(
    (e) => e,
  ) as string[];
  prefixes.forEach((prefix) =>
    suffixes.forEach((suffix) => {
      const appPath = path.join(prefix, suffix);
      if (canAccess(appPath, accessSync)) {
        installs.push(appPath);
      }
    }),
  );
  return installs;
}
