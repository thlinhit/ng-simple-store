import * as path from 'path';

// generic mock for assets
export function process(src, filename, config, options) {
    return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';';
}
