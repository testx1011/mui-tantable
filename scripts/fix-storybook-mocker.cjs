const fs = require('fs');
const path = require('path');

// locate the root of the "storybook" package
const pkgPath = require.resolve('storybook/package.json');
const pkgDir = path.dirname(pkgPath);

const src = path.join(pkgDir, 'dist', 'mocking-utils', 'mocker-runtime.js');
const destDir = path.join(pkgDir, 'assets', 'server');
const dest = path.join(destDir, 'mocker-runtime.template.js');

try {
  if (!fs.existsSync(src)) {
    console.warn('[fix-storybook-mocker] source file not found:', src);
  } else {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    console.log('[fix-storybook-mocker] patched mocker-runtime.template.js');
  }
} catch (err) {
  console.error('[fix-storybook-mocker] failed to patch:', err);
  process.exit(1);
}
