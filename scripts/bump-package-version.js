/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';

import mversion from 'mversion';
import semver from 'semver';

const versionSrc = '../src/version.js';
import currentVersion from versionSrc;

if (!process.env.VERSION) {
  throw new Error('release: usage is VERSION=MAJOR.MINOR.PATCH npm run release');
}

const newVersion = process.env.VERSION;

if (!semver.valid(newVersion)) {
  throw new Error(`release: provided new version (${newVersion}) is not a valid version per semver`);
}

if (semver.gte(currentVersion, newVersion)) {
  throw new Error(`release:
    provided new version is not higher than current version (${newVersion} <= ${currentVersion})`
  );
}

const colors = `\x1b[44m\x1b[37m%s\x1b[0m`;

console.log(colors, `Releasing ${newVersion}`);
console.log(colors, `Updating ${versionSrc}`);

const newContent = `export default ${newVersion}`;
fs.writeFileSync(versionSrc, newContent);

console.log(colors, `Updating package.json, npm-shrinkwrap.json`);

mversion.update(newVersion);
