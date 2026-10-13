const typescript = require('eslint-import-resolver-typescript');

// ESLint 10 removed getPhysicalFilename; eslint-module-utils still falls back to
// the virtual script filename. Resolve Astro scripts relative to their .astro file.
module.exports = {
  interfaceVersion: 2,
  resolve(source, filename, options) {
    const physical = filename.replace(/(\.astro)\/[^/]+\.[cm]?[jt]sx?$/, '$1');
    return typescript.resolve(source, physical, options);
  },
};
