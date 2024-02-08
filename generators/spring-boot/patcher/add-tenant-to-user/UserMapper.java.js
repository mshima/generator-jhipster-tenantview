// Add jpa filter to the entity to remove entries from another tenant
const file = data => `${data.srcMainJava}${data.packageFolder}/service/mapper/UserMapper.java`;

const tmpls = [
  {
    disabled: true,
    type: 'rewriteFile',
    target: () => '            return user;',
    tmpl: data => `user.set${data.tenantEntity.entityClass}(userDTO.get${data.tenantEntity.entityClass}());`,
  },
];

export default {
  file,
  tmpls,
};
