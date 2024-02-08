// Add jpa filter to the entity to remove entries from another tenant
const file = data => `${data.srcMainJava}${data.packageFolder}/repository/UserRepository.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    target: 'findOneByLogin',
    tmpl: 'boolean existsByLogin(String string);',
  },
];

export default {
  file,
  tmpls,
};
