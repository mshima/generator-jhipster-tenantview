/*
 * =======================
 * Init patches
 * getAllJhipsterConfig isn't getting all jhipster config
 * Workaround https://github.com/jhipster/generator-jhipster/issues/10205
 */
function extend(Superclass) {
    return class GeneratorExtender extends Superclass {
        constructor(args, opts) {
            super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

            this.fromBlueprint = opts.fromBlueprint !== undefined ? opts.fromBlueprint : this.rootGeneratorName() !== 'generator-jhipster';
            if (this.fromBlueprint) {
                this.blueprintConfig = this.config;
                this.config = this._getStorage('generator-jhipster');
                this.removeConfigDuplicates();
            }
        }

        removeConfigDuplicates() {
            Object.keys(this.config.getAll()).forEach(key => {
                const value = this.blueprintConfig.get(key);
                if (value !== undefined) {
                    this.config.set(key, value);
                    this.blueprintConfig.delete(key);
                }
            });
        }
    };
}

module.exports = {
    extend
};
