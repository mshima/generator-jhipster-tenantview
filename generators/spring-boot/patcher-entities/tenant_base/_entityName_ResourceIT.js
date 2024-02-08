const file = data => `${data.srcTestJava}${data.packageFolder}web/rest/${data.tenantEntity.entityClass}ResourceIT.java`;

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

export default {
  disabled: true,
  file,
  tmpls,
};
