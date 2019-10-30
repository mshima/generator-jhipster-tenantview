/*
 * =======================
 * Fix getEntityParentPathAddition don't considers paths with '..'
 * https://github.com/jhipster/generator-jhipster/pull/10161
 */
const path = require('path');

function extend(Superclass) {
    return class GeneratorExtender extends Superclass {
        getEntityParentPathAddition(clientRootFolder) {
            if (!clientRootFolder) {
                return '';
            }
            const relative = path.relative(`/app/entities/${clientRootFolder}/`, '/app/entities/');
            if (relative.includes('app')) {
                // Relative path outside angular base dir.
                const msg = `
                    "clientRootFolder outside app base dir '${clientRootFolder}'"
                `;
                // Test case doesn't have a enviroment instance so return 'error'
                if (this.env === undefined) {
                    throw new Error(msg);
                }
                this.error(msg);
            }
            const addition = relative.replace(/[/]?..\/entities/, '').replace('entities', '..');
            if (!addition) {
                return '';
            }
            return `${addition}/`;
        }
    };
}

module.exports = {
    extend
};
