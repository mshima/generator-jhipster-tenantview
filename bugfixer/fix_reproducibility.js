/*
 * =======================
 * Init patches
 * Fix reproducibility
 * https://github.com/jhipster/generator-jhipster/pull/10397
 */
function extend(Superclass) {
    return class GeneratorExtender extends Superclass {
        dateFormatForLiquibase() {
            let now = new Date();
            const lastChangelogDate = this.config.get('lastChangelogDate');
            if (lastChangelogDate !== undefined) {
                now = new Date(Date.parse(lastChangelogDate));
                now.setMinutes(now.getMinutes() + 1);
                this.config.set('lastChangelogDate', now);
            } else {
                const baseChangelogDate = this.options.baseChangelogDate || this.options['base-changelog-date'];
                if (baseChangelogDate !== undefined) {
                    this.log(`Using baseChangelogDate ${baseChangelogDate}`);
                    const time = Date.parse(baseChangelogDate);
                    if (time) {
                        now = new Date(time);
                        this.config.set('baseChangelogDate', baseChangelogDate);
                        this.config.set('lastChangelogDate', now);
                    } else {
                        this.log(`Error parsing baseChangelogDate ${baseChangelogDate}`);
                    }
                }
            }
            const nowUTC = new Date(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds()
            );
            const year = `${nowUTC.getFullYear()}`;
            let month = `${nowUTC.getMonth() + 1}`;
            if (month.length === 1) {
                month = `0${month}`;
            }
            let day = `${nowUTC.getDate()}`;
            if (day.length === 1) {
                day = `0${day}`;
            }
            let hour = `${nowUTC.getHours()}`;
            if (hour.length === 1) {
                hour = `0${hour}`;
            }
            let minute = `${nowUTC.getMinutes()}`;
            if (minute.length === 1) {
                minute = `0${minute}`;
            }
            let second = `${nowUTC.getSeconds()}`;
            if (second.length === 1) {
                second = `0${second}`;
            }
            return `${year}${month}${day}${hour}${minute}${second}`;
        }
    };
}

module.exports = {
    extend
};
