import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { binary, canAccess, homeDir } from '../src/steam_finder';

let workDir: string;

beforeEach(async () => {
  workDir = await fs.mkdtemp(os.tmpdir());
});

afterEach(() => fs.remove(workDir));

test('canAccess should succeed on an existing file', async () => {
  const file = path.join(workDir, 'file');
  await fs.outputFile(file, '');
  expect(canAccess(file, fs.accessSync)).toEqual(true);
});

test('canAccess should fail on a missing existing file', async () => {
  const file = path.join(workDir, 'file');
  expect(canAccess(file, fs.accessSync)).toEqual(false);
});

describe('binary.win32', () => {
  let executable: string;

  beforeEach(() => {
    executable = path.join(
      workDir,
      'Steam',
      'steamapps',
      'common',
      'Tabletop Simulator',
      'Tabletop Simulator.exe',
    );
  });

  test('should check Program Files', async () => {
    expect(
      binary.win32(() => true, {
        PROGRAMFILES: workDir,
      }),
    ).toEqual([executable]);
  });

  test('should check Program Files (X86)', async () => {
    expect(
      binary.win32(() => true, {
        'PROGRAMFILES(X86)': workDir,
      }),
    ).toEqual([executable]);
  });
});

describe('homeDir.win32', () => {
  test('should find the Tabletop Simulator user directory', () => {
    const USERPROFILE = workDir;
    expect(homeDir.win32({ USERPROFILE })).toEqual(
      path.join(workDir, 'Documents', 'My Games', 'Tabletop Simulator'),
    );
  });
});
