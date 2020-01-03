module.exports = {
    condition: context => context.tenantNameLowerFirst !== 'user' && !context.configOptions.skipUserManagement
};
