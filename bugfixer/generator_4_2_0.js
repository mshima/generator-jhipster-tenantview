const _ = require('lodash');
const yoGenerator = require('yeoman-generator');

// Ensure a prototype method is a candidate run by default
const methodIsValid = function(name) {
    return name.charAt(0) !== '_' && name !== 'constructor';
};

/*
 * =======================
 * Update run to yeoman-generator 4.2.0 + queueMethod with object
 */
function extend(Superclass) {
    const GeneratorExtender = class GeneratorExtender extends Superclass {
        /**
         * Schedule methods on a run queue.
         *
         * @param {Function|Object} method: Method to be scheduled or object with function properties.
         * @param {String} [methodName]: Name of the method to be scheduled.
         * @param {String} [queueName]: Name of the queue to be scheduled on.
         * @param {String} [reject]: Reject callback.
         */
        queueMethod(method, methodName, queueName, reject = () => {}) {
            if (typeof queueName === 'function') {
                reject = queueName;
                queueName = 'default';
            } else {
                queueName = queueName || 'default';
            }

            const self = this;
            if (!_.isFunction(method)) {
                if (typeof methodName === 'function') {
                    reject = methodName;
                    methodName = undefined;
                }

                queueName = methodName || queueName;
                // Run each queue items
                _.each(method, (newMethod, newMethodName) => {
                    if (!_.isFunction(newMethod) || !methodIsValid(newMethodName)) return;

                    yoGenerator.prototype.queueMethod.call(self, newMethod, newMethodName, queueName, reject);
                });
                return;
            }
            yoGenerator.prototype.queueMethod.call(self, method, methodName, queueName, reject);
        }
    };
    GeneratorExtender.prototype.run = yoGenerator.prototype.run;
    GeneratorExtender.prototype._getStorage = yoGenerator.prototype._getStorage;
    return GeneratorExtender;
}

module.exports = {
    extend
};
