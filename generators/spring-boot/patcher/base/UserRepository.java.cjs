// Add jpa filter to the entity to remove entries from another tenant
const file = gen => `${gen.SERVER_MAIN_SRC_DIR}${gen.packageFolder}/repository/UserRepository.java`;

const tmpls = [
  {
    type: 'rewriteFile',
    target: 'findOneByLogin',
    tmpl: 'boolean existsByLogin(String string);',
  },
];

module.exports = {
  file,
  tmpls,
};
