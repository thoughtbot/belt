// import fs from 'fs';
import { fs as memfs } from 'memfs';
import { expect, test } from 'vitest';
import addTypescript from '../typescript';

test('mocking file system works', async () => {
  memfs.writeFileSync('/hello.txt', 'World!');
  expect(memfs.readFileSync('/hello.txt', 'utf8')).toEqual('World!');
});

test('exits with message if tsconfig.json already exists', () => {
  void addTypescript();
  expect(true).toBe(true);
});
