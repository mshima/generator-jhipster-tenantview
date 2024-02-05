// Add jpa filter to the entity to remove entries from another tenant
const file = gen => `${gen.SERVER_MAIN_SRC_DIR}${gen.packageFolder}/service/mapper/UserMapper.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    target: () => '            return user;',
    tmpl: context => `user.set${context.tenant.entityClass}(userDTO.get${context.tenant.entityClass}());`,
  },
];

module.exports = {
  file,
  tmpls,
};
