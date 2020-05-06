import path from 'path';

export function darwin(): string {
  throw 'Unsupported Platform: MacOS.';
}

export function linux(): string {
  throw 'Unsupported Platform: Linux.';
}

export function win32(envDict: { [key: string]: string | undefined }): string {
  const userProfile = envDict.USERPROFILE;
  if (!userProfile) {
    throw 'Could not find home directory.';
  }
  return path.join(userProfile, 'Documents', 'My Games', 'Tabletop Simulator');
}
