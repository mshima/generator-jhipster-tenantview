// Add jpa filter to the entity to remove entries from another tenant
const file = context => `${context.SERVER_MAIN_SRC_DIR}${context.packageFolder}/service/mapper/UserMapper.java`;

const tmpls = [
    {
        type: 'rewriteFile',
        target: context => '            return user;',
        tmpl: context => `user.set${context.tenantNameUpperFirst}(userDTO.get${context.tenantNameUpperFirst}());`
    }
];

module.exports = {
    file,
    tmpls
};
