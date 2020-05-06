import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { canAccess, win32 } from '../src/steam_finder';

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

describe('win32', () => {
  let binary: string;

  beforeEach(() => {
    binary = path.join(
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
      win32(() => true, {
        PROGRAMFILES: workDir,
      }),
    ).toEqual([binary]);
  });

  test('should check Program Files (X86)', async () => {
    expect(
      win32(() => true, {
        'PROGRAMFILES(X86)': workDir,
      }),
    ).toEqual([binary]);
  });
});
