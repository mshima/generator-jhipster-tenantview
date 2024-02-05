const file = data => `${data.SERVER_TEST_SRC_DIR}${data.packageFolder}web/rest/${data.tenant.entityClass}ResourceIT.java`;

const tmpls = [
  {
    condition: data => data.tenant,
    type: 'replaceContent',
    target: () => '@WithMockUser',
    tmpl: () => '@WithMockUser(authorities = AuthoritiesConstants.ADMIN)',
  },
  {
    condition: data => data.tenant,
    type: 'rewriteFile',
    target: data => `import ${data.packageName}.service.`,
    tmpl: data => `import ${data.packageName}.security.AuthoritiesConstants;`,
  },
];

module.exports = {
  disabled: true,
  file,
  tmpls,
};
