// Add jpa filter to the entity to remove entries from another tenant
const file = gen => `${gen.constants.SERVER_MAIN_SRC_DIR}${gen.storage.packageFolder}/repository/UserRepository.java`;

const tmpls = [
  {
    type: 'replaceContent',
    regexp: true,
    target: () => '\@EntityGraph\(attributePaths = "authorities"\)',
    tmpl: context => `@EntityGraph(attributePaths = {"authorities", "${context.tenant.entityInstance}"})`
  },
  {
    type: 'replaceContent',
    regexp: true,
    target: () => '\@EntityGraph\(attributePaths = "authorities"\)',
    tmpl: context => `@EntityGraph(attributePaths = {"authorities", "${context.tenant.entityInstance}"})`
  }
];

module.exports = {
  file,
  tmpls
};
