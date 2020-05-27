// Add jpa filter to the entity to remove entries from another tenant
const file = gen => `${gen.constants.SERVER_MAIN_SRC_DIR}${gen.storage.packageFolder}/service/mapper/UserMapper.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    target: context => '            return user;',
    tmpl: context => `user.set${context.tenant.entityClass}(userDTO.get${context.tenant.entityClass}());`
  }
];

module.exports = {
  file,
  tmpls
};
