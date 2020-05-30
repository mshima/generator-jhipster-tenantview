const file = context =>
  `${context.constants.SERVER_TEST_SRC_DIR}${context.storage.packageFolder}/web/rest/${context.tenant.entityClass}ResourceIT.java`;

const tmpls = [
  {
    condition: context => context.isTenant,
    type: 'replaceContent',
    target: () => '@WithMockUser',
    tmpl: () => '@WithMockUser(authorities = AuthoritiesConstants.ADMIN)'
  },
  {
    condition: context => context.isTenant,
    type: 'rewriteFile',
    target: context => `import ${context.storage.packageName}.service.`,
    tmpl: context => `import ${context.storage.packageName}.security.AuthoritiesConstants;`
  }
];

module.exports = {
  file,
  tmpls
};
