import { ChildProcess } from 'child_process';
import path from 'path';
import { launch } from '../src';

const doNotCall = (): never => fail('Should never be called');

test('should fail on an unsupported platform', async () => {
  const pending = launch(
    {},
    {
      cpSpawn: doNotCall,
      fsAccessSync: doNotCall,
      psGetPlatform: () => 'netbsd',
    },
  );
  expect(pending).rejects.toThrowError('Unsupported Platform: netbsd.');
});

test('should fail if no launchers are found', async () => {
  const pending = launch(
    {},
    {
      cpSpawn: doNotCall,
      fsAccessSync: () => {
        // Refuse every attempted path without accessing the FS.
        throw 'Could not be accessed.';
      },
      psGetPlatform: () => 'win32',
    },
  );
  expect(pending).rejects.toThrowError('No Steam installations found.');
});

test('should succeed on a supported platform [win32] with steamAppsBinary set', async () => {
  const process = {
    pid: 1000,
  } as ChildProcess;
  const pending = launch(
    {
      steamAppsPath: path.join('foo', 'bar', 'baz.exe'),
    },
    {
      cpSpawn: (file, args) => {
        if (file !== path.join('foo', 'bar', 'baz.exe')) {
          fail(`Unexpected file: ${file}`);
        }
        expect(file).toEqual(path.join('foo', 'bar', 'baz.exe'));
        expect(args).toEqual(['-novid', '-nosubscription']);
        return process;
      },
      fsAccessSync: () => {
        // Refuse every attempted path without accessing the FS.
        throw 'Could not be accessed.';
      },
      psGetPlatform: () => 'win32',
    },
  );
  expect(pending).resolves.toMatchObject({
    process: {
      pid: 1000,
    },
  });
});

test('should succeed on a supported platform [win32]', async () => {
  const process = {
    pid: 1001,
  } as ChildProcess;
  const pending = launch(
    {
      additionalFlags: ['-window-mode'],
    },
    {
      cpSpawn: (_, args) => {
        expect(args).toEqual(['-novid', '-nosubscription', '-window-mode']);
        return process;
      },
      fsAccessSync: (file) => {
        if (
          file !==
          path.join(
            'foo',
            'bar',
            'baz',
            'Steam',
            'steamapps',
            'common',
            'Tabletop Simulator',
            'Tabletop Simulator.exe',
          )
        ) {
          // Refuse every attempted path without accessing the FS.
          throw 'Could not be accessed.';
        }
      },
      psEnvironment: {
        PROGRAMFILES: path.join('foo', 'bar', 'baz'),
      },
      psGetPlatform: () => 'win32',
    },
  );
  expect(pending).resolves.toMatchObject({
    process: {
      pid: 1001,
    },
  });
});

test('should succeed on a supported platform [win32, 64bit]', async () => {
  const process = {
    pid: 1002,
  } as ChildProcess;
  const pending = launch(
    {
      additionalFlags: ['-hokey', '-pokey'],
      ignoreDefaultFlags: true,
    },
    {
      cpSpawn: (_, args) => {
        expect(args).toEqual(['-hokey', '-pokey']);
        return process;
      },
      fsAccessSync: (file) => {
        if (
          file !==
          path.join(
            'foo',
            'bar',
            'baz (x86)',
            'Steam',
            'steamapps',
            'common',
            'Tabletop Simulator',
            'Tabletop Simulator.exe',
          )
        ) {
          // Refuse every attempted path without accessing the FS.
          throw 'Could not be accessed.';
        }
      },
      psEnvironment: {
        PROGRAMFILES: path.join('foo', 'bar', 'baz'),
        'PROGRAMFILES(X86)': path.join('foo', 'bar', 'baz (x86)'),
      },
      psGetPlatform: () => 'win32',
    },
  );
  expect(pending).resolves.toMatchObject({
    process: {
      pid: 1002,
    },
  });
});
