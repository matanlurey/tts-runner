import path from 'path';

export function canAccess(
  file: string,
  accessSync: (path: string) => void,
): boolean {
  try {
    accessSync(file);
    return true;
  } catch (_) {
    return false;
  }
}

function darwinBinary(): string[] {
  throw 'Unsupported Platform: MacOS.';
}

function linuxBinary(): string[] {
  throw 'Unsupported Platform: Linux.';
}

function win32Binary(
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

export const binary = {
  win32: win32Binary,
  darwin: darwinBinary,
  linux: linuxBinary,
};

function darwinHome(): string {
  throw 'Unsupported Platform: MacOS.';
}

function linuxHome(): string {
  throw 'Unsupported Platform: Linux.';
}

function win32Home(envDict: { [key: string]: string | undefined }): string {
  const userProfile = envDict.USERPROFILE;
  if (!userProfile) {
    throw 'Could not find home directory.';
  }
  return path.join(userProfile, 'Documents', 'My Games', 'Tabletop Simulator');
}

export const homeDir = {
  win32: win32Home,
  dartwin: darwinHome,
  linux: linuxHome,
};
