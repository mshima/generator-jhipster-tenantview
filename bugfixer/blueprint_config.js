/*
 * =======================
 * Init patches
 * Issue: https://github.com/jhipster/generator-jhipster/issues/10663
 * PR: https://github.com/jhipster/generator-jhipster/pull/10664
 */
function extend(Superclass) {
    return class GeneratorExtender extends Superclass {
        constructor(args, opts) {
            super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

            this.fromBlueprint = opts.fromBlueprint !== undefined ? opts.fromBlueprint : this.rootGeneratorName() !== 'generator-jhipster';
            if (this.fromBlueprint) {
                this.blueprintConfig = this.config;
                this.config = this._getStorage('generator-jhipster');
            }
        }
    };
}

module.exports = {
    extend
};
